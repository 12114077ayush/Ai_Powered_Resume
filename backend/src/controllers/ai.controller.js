import { Resume } from "../models/resume.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateSmartResume = async (req, res) => {
  const { jobDescription, resumeId } = req.body;

  if (!jobDescription || !resumeId) {
    throw new ApiError(400, "Job Description and Resume ID are required.");
  }

  const resume = await Resume.findById(resumeId);

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  const enhanchedResume = await generateResumeFromJD(resume, jobDescription);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { enhanchedResume },
        "AI generated resume suggestions."
      )
    );
};

export { generateSmartResume };
