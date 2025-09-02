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
    <div className="flex h-full flex-col">
      <div className="flex flex-none flex-row justify-between">
        <h1
          className="text-grad-stroke text-[36px] font-[700]"
          data-text="Messages"
        >
          Messages
        </h1>
      </div>
      <div className="flex min-h-0 flex-1 snap-y snap-mandatory flex-col gap-3 overflow-y-auto scroll-smooth">
        <div className="grid h-full shrink-0 snap-start grid-cols-12 grid-rows-12 gap-3 p-4">
          <div className="col-span-3 row-span-12 flex flex-col overflow-auto rounded p-4 shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)]"></div>
          <div className="col-span-9 row-span-12 flex flex-col overflow-auto rounded p-4 shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)]"></div>
        </div>
      </div>
    </div>
  );
}

export default Messages;
