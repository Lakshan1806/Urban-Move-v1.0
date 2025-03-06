//const express = require("express");
import express from "express";
import dotenv, { config } from "dotenv";
import { connectDB } from "./config/db.js";
import cors from "cors";
import sampleRoute from "./routes/sampleRoute.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/user", sampleRoute);

console.log(process.env.MONGO_URI);

app.listen(5000, () => {
  connectDB();
  console.log("Server started at http://localhost:5000");
});
