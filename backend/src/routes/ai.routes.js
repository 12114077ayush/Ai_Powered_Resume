import { generateSmartResume } from "../controllers/ai.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { saveAIResume } from "../controllers/save_Ai_Resume.controller.js";

const router = Router();

router.route("/generate-resume").post(verifyJWT, generateSmartResume);
router.route("/save-ai-resume", verifyJWT, saveAIResume);
export default router;
