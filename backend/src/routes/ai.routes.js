import { generateSmartResume } from "../controllers/ai.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/generate-resume").post(verifyJWT, generateSmartResume);

export default router;
