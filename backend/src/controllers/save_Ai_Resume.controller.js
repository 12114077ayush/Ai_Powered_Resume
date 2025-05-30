import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { Resume } from "../models/resume.model";

const saveAIResume = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    phone,
    title,
    summary,
    skills,
    experience,
    education,
    projects,
    sourceJobDescription,
  } = req.body;

  const resume = await Resume.create({
    user: req.user._id,
    fullName,
    email,
    phone,
    title,
    summary,
    skills,
    experience,
    education,
    projects,
    aiGenerated: true,
    sourceJobDescription,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, resume, "AI resume saved successfully"));
});

export { saveAIResume };
