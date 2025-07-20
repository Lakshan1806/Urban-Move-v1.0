import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

// Gradient text utility class for reuse
const gradientTextClass = "bg-gradient-to-r from-[#ff7c1d] to-[#ffd12e] bg-clip-text text-transparent font-semibold";

const ChatAndCall = () => {
  const [userId, setUserId] = useState("");
  const [driverId, setDriverId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [inCall, setInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const localAudioRef = useRef();
  const remoteAudioRef = useRef();
  const peerConnection = useRef(null);
  const localStream = useRef(null);
  const messagesEndRef = useRef(null);

  const servers = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

  useEffect(() => {
    const fetchUserAndDriver = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", { withCredentials: true });
        const loggedInUserId = res.data?.user?._id;
        setUserId(loggedInUserId);

        const rideRes = await axios.get(`http://localhost:5000/api/driverrides/latest-ride/${loggedInUserId}`);
        setDriverId(rideRes.data.driverId);

        const genRoomId = [loggedInUserId, rideRes.data.driverId].sort().join("_");
        setRoomId(genRoomId);
      } catch (err) {
        console.error("Failed to load user or driver ID", err);
      }
    };
    fetchUserAndDriver();
  }, []);

  useEffect(() => {
    if (userId) {
      socket.emit("authenticate", userId);
    }
  }, [userId]);

  useEffect(() => {
    if (!roomId) return;

    socket.emit("join-room", { roomId });

    axios.get(`http://localhost:5000/api/messages/${roomId}`)
      .then(res => {
        setMessages(res.data);
      })
      .catch(err => console.error("Failed to fetch messages", err));
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;

    const interval = setInterval(() => {
      axios.get(`http://localhost:5000/api/messages/${roomId}`)
        .then(res => setMessages(res.data))
        .catch(err => console.error("Failed to fetch messages", err));
    }, 1000);

    return () => clearInterval(interval);
  }, [roomId]);

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setMessages(prev => [...prev, data]);
    };

    socket.on("receive-message", handleReceiveMessage);

    socket.on("call-made", async ({ offer, socket: fromSocket }) => {
      try {
        await setupMedia();

        peerConnection.current = new RTCPeerConnection(servers);
        addLocalTracks();

        peerConnection.current.ontrack = ({ streams: [stream] }) => {
          remoteAudioRef.current.srcObject = stream;
        };

        peerConnection.current.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("ice-candidate", { toUserId: fromSocket, candidate: event.candidate });
          }
        };

        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);

        socket.emit("make-answer", { answer, toUserId: fromSocket });

        setInCall(true);
      } catch (error) {
        console.error("Error handling call-made", error);
      }
    });

    socket.on("answer-made", async ({ answer }) => {
      try {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
        setInCall(true);
      } catch (error) {
        console.error("Error handling answer-made", error);
      }
    });

    socket.on("ice-candidate", ({ candidate }) => {
      if (peerConnection.current) {
        peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate)).catch(console.error);
      }
    });

    return () => {
      socket.off("receive-message", handleReceiveMessage);
      socket.off("call-made");
      socket.off("answer-made");
      socket.off("ice-candidate");
    };
  }, []);

  useEffect(() => {
    return () => {
      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }
      if (localStream.current) {
        localStream.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const setupMedia = async () => {
    try {
      localStream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      localAudioRef.current.srcObject = localStream.current;
    } catch (err) {
      console.error("Error accessing media devices", err);
      alert("Microphone access denied or not available.");
    }
  };

  const addLocalTracks = () => {
    if (localStream.current && peerConnection.current) {
      localStream.current.getTracks().forEach(track => peerConnection.current.addTrack(track, localStream.current));
    }
  };

  const initiateCall = async () => {
    try {
      await setupMedia();

      peerConnection.current = new RTCPeerConnection(servers);
      addLocalTracks();

      peerConnection.current.ontrack = ({ streams: [stream] }) => {
        remoteAudioRef.current.srcObject = stream;
      };

      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", { toUserId: driverId, candidate: event.candidate });
        }
      };

      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);

      socket.emit("call-user", { offer, toUserId: driverId });

      setInCall(true);
    } catch (error) {
      console.error("Error initiating call", error);
    }
  };

  const endCall = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    if (localStream.current) {
      localStream.current.getTracks().forEach(track => track.stop());
    }
    setInCall(false);
    setIsMuted(false);
  };

  const toggleMute = () => {
    if (localStream.current) {
      const audioTrack = localStream.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = isMuted;
        setIsMuted(!isMuted);
      }
    }
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;
    if (!userId || !driverId || !roomId) return;

    const newMsg = { senderId: userId, receiverId: driverId, message: userInput, roomId };
    socket.emit("send-message", newMsg);
    try {
      await axios.post("http://localhost:5000/api/messages", newMsg);
      setUserInput("");
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  // Determine styling & sender label per message
  const getSenderInfo = (msg) => {
    if (msg.senderId === userId) {
      return {
        label: "You",
        bubbleBg: "bg-gradient-to-r from-[#ff7c1d] to-[#ffd12e]",
        textColor: "text-black",
        align: "self-end",
      };
    } else {
      return {
        label: "Driver",
        bubbleBg: "bg-black",
        textColor: "bg-gradient-to-r from-[#ff7c1d] to-[#ffd12e] bg-clip-text text-transparent",
        align: "self-start",
      };
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8 text-gray-900 font-sans">
      <h1 className={`text-4xl mb-8 font-light bg-gradient-to-r from-[#ff7c1d] to-[#ffd12e] bg-clip-text text-transparent`}>
        UrbanMove Live Chat & Call
      </h1>

      {roomId ? (
        <>
           {/* Room ID display hidden */}
    {/* <div className="mb-4 font-semibold text-gray-700 select-all">
      Room ID: <code>{roomId}</code>
    </div> */}


          <div className="flex gap-4 mb-8 flex-wrap justify-center">
            <button
              onClick={initiateCall}
              disabled={inCall}
              className="bg-black rounded-full px-6 py-2 text-white text-lg cursor-pointer transition-shadow hover:shadow-[0_0_10px_2px_rgba(255,124,29,0.8)] disabled:opacity-50 disabled:cursor-not-allowed"
              title="Start Call"
            >
              📞 Start Call
            </button>
            <button
              onClick={toggleMute}
              disabled={!inCall}
              className="bg-black rounded-full px-6 py-2 text-white text-lg cursor-pointer transition-shadow hover:shadow-[0_0_10px_2px_rgba(255,124,29,0.8)] disabled:opacity-50 disabled:cursor-not-allowed"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? "🔊 Unmute" : "🔇 Mute"}
            </button>
            <button
              onClick={endCall}
              disabled={!inCall}
              className="bg-red-600 rounded-full px-6 py-2 text-white text-lg cursor-pointer transition-shadow hover:shadow-[0_0_10px_2px_rgba(255,0,0,0.8)] disabled:opacity-50 disabled:cursor-not-allowed"
              title="End Call"
            >
              ❌ End Call
            </button>
          </div>

          <div className="w-full max-w-3xl h-72 overflow-y-auto bg-white rounded-lg shadow-lg p-6 flex flex-col gap-2 text-sm">
            {messages.map((msg, idx) => {
              const sender = getSenderInfo(msg);
              return (
                <div
                  key={idx}
                  className={`${sender.align} rounded-2xl px-4 py-2 max-w-[70%] break-words shadow-sm relative ${sender.bubbleBg}`}
                  title={sender.label}
                >
                  <span className={`block mb-1 text-xs select-none ${sender.textColor}`}>
                    {sender.label}
                  </span>
                  <p className={sender.textColor}>{msg.message}</p>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <div className="w-full max-w-3xl mt-6 flex gap-3 rounded-full p-[2px] bg-gradient-to-r from-[#ff7c1d] to-[#ffd12e]">
            <input
              type="text"
              placeholder="Type a message..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-grow rounded-full border border-gray-300 p-3 text-black placeholder-black outline-none"
            />
            <button
              onClick={sendMessage}
              className="bg-black rounded-full px-6 py-2 text-white"
              title="Send Message"
            >
              Send
            </button>
          </div>
        </>
      ) : (
        <p>Loading chat...</p>
      )}

      <audio ref={localAudioRef} autoPlay muted />
      <audio ref={remoteAudioRef} autoPlay />
    </div>
  );
};

export default ChatAndCall;
