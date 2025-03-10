import express from "express";
import feedbackController from "../controllers/feedbackController.js";

const feedbackRoutes = express.Router();

feedbackRoutes.post("/submit",feedbackController.submit )

export default feedbackRoutes;