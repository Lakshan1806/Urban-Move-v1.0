import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cors from "cors";
import adminRoutes from "./routes/adminRoutes.js";
import checkAndCreateAdmin from "./utils/adminInitialSetup.js";
import schedulePromoCleanup from "./utils/schedulePromoCleanup.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import userRoutes from "./routes/userRoute.js";
import RideRoute from "./routes/rideRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js"
import passport from "passport";
import MongoStore from "connect-mongo";
import "./config/passport.js";
import carRoutes from "./routes/carRoutes.js"
import locationRoutes from "./routes/locationRoute.js"
import DriverfetchRoutes from "./routes/DriverfetchRoute.js"
import driverRideRoutes from './routes/driverRideRoutes.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import liveTrackingRoutes from './routes/liveTrackingRoutes.js';



const PORT = 5000;
dotenv.config();

if (!process.env.SESSION_SECRET || !process.env.MONGO_URI) {
  console.error(" Missing SESSION_SECRET or MONGO_URI in .env file");
  process.exit(1);
}
 
const app = express();

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173", "http://localhost:5174"],
  })
);

app.use(
  session({ 
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/auth", userRoutes);
app.use("/uploads", express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), "/uploads")));
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/rideRoute", RideRoute);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/driver", DriverfetchRoutes);
app.use('/api/driver-rides', driverRideRoutes);
app.use('/api/live-tracking', liveTrackingRoutes);

app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

async function startServer() {
  await connectDB();
  await checkAndCreateAdmin();
  schedulePromoCleanup();
  
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:5174"],
      methods: ["GET", "POST"]
    }
  });

  // Socket.IO connection handler
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Handle driver authentication
    socket.on('driver:authenticate', (driverId) => {
      socket.join(`driver_${driverId}`);
      console.log(`Driver ${driverId} connected`);
    });

    // Handle ride requests
    socket.on('ride:request', (rideData) => {
      io.emit('ride:requested', rideData);
    });

    // Handle ride acceptance
    socket.on('ride:accept', (rideId) => {
      io.emit('ride:accepted', { rideId, status: 'accepted' });
    });

    // Handle ride decline
    socket.on('ride:decline', (rideId) => {
      io.emit('ride:declined', { rideId, status: 'declined' });
    });

    // Handle driver location updates
    socket.on('driver:location', (data) => {
      io.emit('driver:locationUpdate', data);
    });

    // Handle ride completion
    socket.on('ride:complete', (rideId) => {
      io.emit('ride:completed', { rideId, status: 'completed' });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  httpServer.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
  });
}

startServer();