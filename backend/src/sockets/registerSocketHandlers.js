const registerSocketHandlers = (io) => {
  const userSocketMap = new Map();

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("authenticate", (userId) => {
      userSocketMap.set(userId, socket.id);
      console.log(`User ${userId} associated with socket ${socket.id}`);
    });

    socket.on("join-room", ({ roomId }) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    socket.on("send-message", (data) => {
      const { receiverId, roomId } = data;

      io.to(roomId).emit("receive-message", data);

      const receiverSocketId = userSocketMap.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive-message", data);
        console.log(`Message sent to receiver socket: ${receiverSocketId}`);
      }
    });

    socket.on("call-user", ({ offer, to }) => {
      const targetSocketId = userSocketMap.get(to);
      if (targetSocketId) {
        socket.to(targetSocketId).emit("call-made", { offer, socket: socket.id });
      }
    });

    socket.on("make-answer", ({ answer, to }) => {
      const targetSocketId = userSocketMap.get(to);
      if (targetSocketId) {
        socket.to(targetSocketId).emit("answer-made", { answer });
      }
    });

    socket.on("ice-candidate", ({ candidate, to }) => {
      const targetSocketId = userSocketMap.get(to);
      if (targetSocketId) {
        socket.to(targetSocketId).emit("ice-candidate", { candidate });
      }
    });

    socket.on("driver:authenticate", (driverId) => {
      socket.join(`driver_${driverId}`);
      console.log(`Driver ${driverId} connected`);
    });

    socket.on("ride:request", (rideData) => {
      io.emit("ride:requested", rideData);
    });

    socket.on("ride:accept", (rideId) => {
      io.emit("ride:accepted", { rideId, status: "accepted" });
    });

    socket.on("ride:decline", (rideId) => {
      io.emit("ride:declined", { rideId, status: "declined" });
    });

    socket.on("driver:location", (data) => {
      io.emit("driver:locationUpdate", data);
    });

    socket.on("ride:complete", (rideId) => {
      io.emit("ride:completed", { rideId, status: "completed" });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
      for (const [userId, sId] of userSocketMap.entries()) {
        if (sId === socket.id) {
          userSocketMap.delete(userId);
          break;
        }
      }
    });
  });
};

export default registerSocketHandlers;
