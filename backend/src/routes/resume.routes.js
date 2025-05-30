import { Router } from "express";
import {
  createResume,
  getAllResume,
  getResumeById,
  updateResume,
  deleteResume,
  addproject,
  updateProject,
  deleteProject,
} from "../controllers/resume.controller.js";
import { uploadResumeFile } from "../controllers/uploadResumeFile.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

//Resume CRUD
router.post("/", createResume);
router.get("/", getAllResume);
router.get("/:id", getResumeById);
router.put("/:id", updateResume);
router.delete("/:id", deleteResume);

// Projects
router.post("/:id/project", addproject);
router.put("/:resumeId/project/:projectId", updateProject);
router.delete("/:resumeId/project/:projectId", deleteProject);

//upload resume
router.post(
  "/upload-resume/:resumeId",
  upload.single("resumeFile"), // expecting form field name = resumeFile
  uploadResumeFile
);

export default router;
