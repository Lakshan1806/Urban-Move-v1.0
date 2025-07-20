import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import cookieParser from "cookie-parser";
import { createServer } from 'http';
import { Server } from 'socket.io';
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoute.js";
import RideRoute from "./routes/rideRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import carRoutes from "./routes/carRoutes.js";
import locationRoutes from "./routes/locationRoute.js";
import DriverfetchRoutes from "./routes/DriverfetchRoute.js";
import driverRideRoutes from './routes/driverRideRoutes.js';
import feedbackRoutes from "./routes/feedbackRoutes.js";
import liveTrackingRoutes from './routes/liveTrackingRoutes.js';
import tripHistoryRoutes from "./routes/tripHistoryRoutes.js";
import promoRoutes from "./routes/promotionRoutes.js";
import { emailRoutes } from "./routes/email.js";
import messageRoutes from "./routes/messageRoutes.js";
import checkAndCreateAdmin from "./utils/adminInitialSetup.js";
import schedulePromoCleanup from "./utils/schedulePromoCleanup.js";
import callLogRoutes from './routes/callLogRoutes.js';
import "./config/passport.js";
import promotionRoutes from "./routes/promotionRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";

dotenv.config();
const PORT = 5000;

if (!process.env.SESSION_SECRET || !process.env.MONGO_URI) {
  console.error("Missing SESSION_SECRET or MONGO_URI in .env file");
  process.exit(1);
}

const app = express();

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173", "http://localhost:5174"],
  })
);

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: "sessions",
  }),
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  "/uploads",
  express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), "/uploads"))
);

app.use("/auth", userRoutes);
app.use("/user", userRoutes);
app.use("/api/auth", userRoutes);
app.use("/admin", adminRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/rideRoute", RideRoute);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/driver", DriverfetchRoutes);
app.use("/api/driver-rides", driverRideRoutes);
app.use("/api/driverrides", driverRideRoutes);
app.use("/api/live-tracking", liveTrackingRoutes);
app.use("/api/triphistory", tripHistoryRoutes);
app.use("/api/promo", promoRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/messages", messageRoutes);
app.use('/api/call-log', callLogRoutes);
app.use("/api/promotions", promotionRoutes);

app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

app.get("/", (req, res) => {
  res.send("Server is ready");
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
console.log(path.join(__dirname, "/uploads"));

app.use(express.json());

app.use(cookieParser());
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/feedbacks", feedbackRoutes);

console.log(process.env.MONGO_URI);
console.log("server is ready");
console.log("Current Working Directory:", process.cwd());

//app.use("/api/auth", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/rideRoute", RideRoute);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/location",locationRoutes);
app.use("/api/driver",DriverfetchRoutes);
app.use('/api/driver-rides', driverRideRoutes);

async function startServer() {
  await connectDB();
  await checkAndCreateAdmin();
  schedulePromoCleanup();

  const httpServer = createServer(app);

  const io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:5174"],
      methods: ["GET", "POST"],
    },
  });

  const userSocketMap = new Map();

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('authenticate', (userId) => {
      userSocketMap.set(userId, socket.id);
      console.log(`User ${userId} associated with socket ${socket.id}`);
    });

    socket.on("join-room", ({ roomId }) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    socket.on("send-message", (data) => {
      const { senderId, receiverId, roomId, message } = data;

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

    socket.on('driver:authenticate', (driverId) => {
      socket.join(`driver_${driverId}`);
      console.log(`Driver ${driverId} connected`);
    });

    socket.on('ride:request', (rideData) => {
      io.emit('ride:requested', rideData);
    });

    socket.on('ride:accept', (rideId) => {
      io.emit('ride:accepted', { rideId, status: 'accepted' });
    });

    socket.on('ride:decline', (rideId) => {
      io.emit('ride:declined', { rideId, status: 'declined' });
    });

    socket.on('driver:location', (data) => {
      io.emit('driver:locationUpdate', data);
    });

    socket.on('ride:complete', (rideId) => {
      io.emit('ride:completed', { rideId, status: 'completed' });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      for (const [userId, sId] of userSocketMap.entries()) {
        if (sId === socket.id) {
          userSocketMap.delete(userId);
          break;
        }
      }
    });
  });

  httpServer.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
  });
}

startServer();
