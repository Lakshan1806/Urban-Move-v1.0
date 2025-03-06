import express from "express";
import sampleController from "../controllers/sampleController.js";

const router = express.Router();

router.get("/api/login",sampleController.login);
router.get("/data",sampleController.data);
router.post("/",sampleController.root);

export default router;
