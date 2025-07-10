import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cors from "cors";
import adminRoutes from "./routes/adminRoutes.js";
import checkAndCreateAdmin from "./utils/adminInitialSetup.js";
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

app.use("/auth", userRoutes);

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

console.log(process.env.MONGO_URI);
console.log("server is ready");
console.log("Current Working Directory:", process.cwd()); 

//app.use("/api/auth", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/rideRoute", RideRoute);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/location",locationRoutes);
app.use("/api/driver",DriverfetchRoutes);

async function startServer() {
  await connectDB();
  await checkAndCreateAdmin();

  app.listen(5000, () => {
    console.log("Server started at http://localhost:5000");
  });
}




startServer();
