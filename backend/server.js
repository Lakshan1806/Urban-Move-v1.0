import express from "express";
import dotenv, { config } from "dotenv";
import { connectDB } from "./config/db.js";
import cors from "cors";
import adminRoutes from "./routes/adminRoute.js";
import checkAndCreateAdmin from "./utils/adminInitialSetup.js";
import feedbackRoutes from "./routes/feedbackRoute.js";

dotenv.config();
const app = express();
app.use(cors());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log("server is ready");

app.use("/admin", adminRoutes);
app.use("/feedback", feedbackRoutes);

console.log(process.env.MONGO_URI);

async function startServer() {
  await connectDB();
  await checkAndCreateAdmin();
  app.listen(5000, () => {
    console.log("Server started at http://localhost:5000");
  });
}

startServer();
