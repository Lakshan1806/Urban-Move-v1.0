import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

function Messages() {
  const [socket, setSocket] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const newSocket = io("http://localhost:5000", {
      withCredentials: true,
      transports: ["websocket"],
    });

    const handleActiveUsers = (users) => {
      setDrivers(users);
    };

    const handleReceiveMessage = (msg) => {
      if (msg.from === selectedDriver || msg.to === selectedDriver) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    newSocket.on("active-users", handleActiveUsers);
    newSocket.on("receive-message", handleReceiveMessage);
    newSocket.emit("register-user", "admin");
    setSocket(newSocket);

    return () => {
      newSocket.off("active-users", handleActiveUsers);
      newSocket.off("receive-message", handleReceiveMessage);
      newSocket.disconnect();
    };
  }, [selectedDriver]);

  useEffect(() => {
    if (!selectedDriver) return;
    async function fetchHistory() {
      try {
        const res = await axios.get("/api/chat/history", {
          params: { driverId: selectedDriver },
        });
        setMessages(res.data || []);
      } catch (err) {
        console.error("Failed to load history", err);
        setMessages([]);
      }
    }
    fetchHistory();
  }, [selectedDriver]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!socket || !messageInput.trim() || !selectedDriver) return;
    const msg = {
      from: "admin",
      to: selectedDriver,
      message: messageInput.trim(),
      timestamp: new Date(),
    };
    socket.emit("send-message", msg);
    setMessages((prev) => [...prev, msg]);
    setMessageInput("");
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-row justify-between flex-none">
        <h1
          className="text-grad-stroke font-[700] text-[36px]"
          data-text="Messages"
        >
          Messages
        </h1>
      </div>
      <div className="flex-1 min-h-0"></div>
      <div className="flex flex-1 min-h-0 divide-x">
        <div className="w-1/4 overflow-y-auto p-2">
          <h2 className="font-bold mb-2">Drivers</h2>
          <ul>
            {drivers.map((d) => (
              <li
                key={d.id}
                className={`p-2 rounded cursor-pointer mb-1 ${
                  selectedDriver === d.id
                    ? "bg-orange-100"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedDriver(d.id)}
              >
                {d.name || d.id}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-2">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`mb-2 ${m.from === "admin" ? "text-right" : "text-left"}`}
              >
                <div
                  className={`inline-block px-3 py-2 rounded ${
                    m.from === "admin"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {m.message}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-2 border-t flex gap-2">
            <input
              className="border flex-1 rounded p-1"
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder={
                selectedDriver ? "Type a message" : "Select a driver"
              }
              disabled={!selectedDriver}
            />
            <button
              className="bg-orange-500 text-white px-3 rounded disabled:bg-gray-300"
              onClick={sendMessage}
              disabled={!selectedDriver || !messageInput.trim()}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messages;
