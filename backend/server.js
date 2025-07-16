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
import scheduleRoutes from "./routes/scheduleRoutes.js";
import passport from "passport";
import MongoStore from "connect-mongo";
import "./config/passport.js";
import carRoutes from "./routes/carRoutes.js";
import locationRoutes from "./routes/locationRoute.js";
import DriverfetchRoutes from "./routes/DriverfetchRoute.js";
import driverRideRoutes from './routes/driverRideRoutes.js';
import liveTrackingRoutes from './routes/liveTrackingRoutes.js';
import tripHistoryRoutes from "./routes/tripHistoryRoutes.js";
import { createServer } from 'http';
import { Server } from 'socket.io';
import promoRoutes from "./routes/promotionRoutes.js";
import { emailRoutes } from "./routes/email.js";
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

// Static files
app.use(
  "/uploads",
  express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), "/uploads"))
);

// Routes
app.use("/auth", userRoutes);
app.use("/user", userRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/rideRoute", RideRoute);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/driver", DriverfetchRoutes);
app.use("/api/driver-rides", driverRideRoutes);
app.use("/api/live-tracking", liveTrackingRoutes);
app.use("/api/triphistory", tripHistoryRoutes);
app.use("/api/promo", promoRoutes);
app.use("/api/email", emailRoutes);
// Root
app.get("/", (req, res) => {
  res.send("Server is ready");
});

// Error handler
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
      methods: ["GET", "POST"],
    },
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

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
    });
  });

  httpServer.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
  });
}

startServer();
