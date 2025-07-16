import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

const ChatAndCall = () => {
  const [userId, setUserId] = useState("");
  const [userRole, setUserRole] = useState(""); // NEW: track user or driver
  const [driverId, setDriverId] = useState("");
  const [otherUserId, setOtherUserId] = useState(""); // NEW: store userId from ride
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

  const logCall = async (status) => {
    if (!userId) return;
    try {
      await axios.post("http://localhost:5000/api/call-log/call-log", {
        userId,
        callType: "audio",
        callStatus: status,
      });
    } catch (err) {
      console.error("Failed to log call", err);
    }
  };

  useEffect(() => {
    const fetchUserAndDriver = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", { withCredentials: true });
        const loggedInUserId = res.data?.user?._id;
        const role = res.data?.user?.role;

        setUserId(loggedInUserId);
        setUserRole(role);

        const rideRes = await axios.get(`http://localhost:5000/api/driverrides/latest-ride/${loggedInUserId}`);
        setDriverId(rideRes.data.driverId);
        setOtherUserId(rideRes.data.userId);

        // Generate consistent room ID
        const genRoomId = [rideRes.data.userId, rideRes.data.driverId].sort().join("_");
        setRoomId(genRoomId);
      } catch (err) {
        console.error("Failed to load user or driver ID", err);
      }
    };
    fetchUserAndDriver();
  }, []);

  useEffect(() => {
    if (!roomId) return;

    socket.emit("join-room", { roomId });

    axios.get(`http://localhost:5000/api/messages/${roomId}`)
      .then(res => setMessages(res.data))
      .catch(err => console.error("Failed to fetch messages", err));

    socket.on("receive-message", (data) => setMessages((prev) => [...prev, data]));

    socket.on("call-made", async ({ offer, socket: from }) => {
      try {
        await setupMedia();

        peerConnection.current = new RTCPeerConnection(servers);
        addLocalTracks();

        peerConnection.current.ontrack = ({ streams: [stream] }) => {
          remoteAudioRef.current.srcObject = stream;
        };

        peerConnection.current.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("ice-candidate", { to: from, candidate: event.candidate });
          }
        };

        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);

        socket.emit("make-answer", { answer, to: from });

        setInCall(true);
        await logCall("started");
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
        peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate)).catch(e => {
          console.error("Error adding ICE candidate", e);
        });
      }
    });

    return () => {
      socket.off("receive-message");
      socket.off("call-made");
      socket.off("answer-made");
      socket.off("ice-candidate");
    };
  }, [roomId]);

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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
      localStream.current.getTracks().forEach((track) => peerConnection.current.addTrack(track, localStream.current));
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
          socket.emit("ice-candidate", { to: driverId, candidate: event.candidate });
        }
      };

      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);

      socket.emit("call-user", { offer, to: driverId });

      setInCall(true);
      await logCall("started");
    } catch (error) {
      console.error("Error initiating call", error);
    }
  };

  const endCall = async () => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
    }
    setInCall(false);
    await logCall("completed");
  };

  const toggleMute = () => {
    if (localStream.current) {
      const audioTrack = localStream.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = isMuted ? true : false; 
        setIsMuted(!isMuted);
      }
    }
  };

  const sendMessage = async () => {
    if (!userInput.trim() || !userId || !roomId) return;

    const receiverId = userRole === "user" ? driverId : otherUserId;

    const newMsg = {
      senderId: userId,
      receiverId,
      message: userInput,
      roomId,
    };

    socket.emit("send-message", newMsg);
    try {
      await axios.post("http://localhost:5000/api/messages", newMsg);
      setUserInput("");
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100 text-gray-900">
      <h1 className="text-4xl font-light mb-8 text-orange-500">UrbanMove Live Chat & Call</h1>

      {roomId ? (
        <>
          <div className="mb-4 font-semibold">Room ID: <code>{roomId}</code></div>

          <div className="flex gap-4 mb-8">
            <button onClick={initiateCall} disabled={inCall} className="bg-green-500 text-white px-5 py-2 rounded hover:bg-green-600 disabled:opacity-50">
              📞 Start Call
            </button>
            <button onClick={toggleMute} disabled={!inCall} className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 disabled:opacity-50">
              {isMuted ? "🔊 Unmute" : "🔇 Mute"}
            </button>
            <button onClick={endCall} disabled={!inCall} className="bg-red-500 text-white px-5 py-2 rounded hover:bg-red-600 disabled:opacity-50">
              ❌ End Call
            </button>
          </div>

          <div className="w-full max-w-3xl h-72 overflow-y-auto border rounded bg-white p-6 mb-8 space-y-3">
            {messages.map((msg, idx) => (
              <div key={idx} className="text-sm">
                <strong className="text-blue-600">
                  {msg.senderId === userId
                    ? "You"
                    : userRole === "user"
                    ? "Driver"
                    : "User"}:
                </strong>{" "}
                {msg.message}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="w-full max-w-2xl flex flex-col">
            <input
              type="text"
              placeholder="Type a message..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="p-3 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={sendMessage} className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 shadow">
              Send Message
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
