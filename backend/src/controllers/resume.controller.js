import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Resume } from "../models/resume.model.js";

const createResume = asyncHandler(async (req, res) => {
  const {
    title,
    summary,
    skills,
    experience,
    education,
    projects,
    aiGenerated,
    sourceJobDescription,
  } = req.body;

  if (!title) {
    throw new ApiError(400, "Title Field is required");
  }

  const resume = await Resume.create({
    user: req.user._id,
    title,
    summary,
    skills,
    experience,
    education,
    projects,
    aiGenerated: aiGenerated ?? false,
    sourceJobDescription: sourceJobDescription ?? "",
  });

  if (!resume) {
    throw new ApiError(500, "Internal server Error while Creating Resume");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, resume, "Resume Created Successfully"));
});

const getAllResume = asyncHandler(async (req, res) => {
  // Ensure user is authenticated
  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  const resumes = await Resume.find({ user: req.user._id }).sort({
    updatedAt: -1,
  });

  return res
    .status(200)
    .json(new ApiResponse(201, resumes, "Resume Fetched Successfully"));
});

const getResumeById = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!resume) {
    throw new ApiError(400, "Resume not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, resume, "Resume by id fetched successfully"));
});

const updateResume = asyncHandler(async (req, res) => {
  const { title, summary, education, experience, skills, projects } = req.body;

  const resume = await Resume.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  if (title !== undefined) resume.title = title;
  if (summary !== undefined) resume.summary = summary;
  if (education !== undefined) resume.education = education;
  if (experience !== undefined) resume.experience = experience;
  if (skills !== undefined) resume.skills = skills;
  if (projects !== undefined) resume.projects = projects;

  await resume.save();

  return res
    .status(200)
    .json(new ApiResponse(200, resume, "Resume updated successfully"));
});

const deleteResume = asyncHandler(async (req, res) => {
  const deleted = await Resume.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!deleted) {
    throw new ApiError(404, "Resume not found to delete");
  }

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Resume deleted successfully "));
});

// project controller //

const addproject = asyncHandler(async (req, res) => {
  const { name, description, link, technologies = [] } = req.body;

  if (!name) throw new ApiError(400, "Project name is required");

  const resume = await Resume.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  resume.projects.push({ name, description, link, technologies });
  await resume.save();

  res
    .status(200)
    .json(
      new ApiResponse(200, resume, "Project added successfully into resume")
    );
});

const updateProject = asyncHandler(async (req, res) => {
  const { name, description, link, technology } = req.body;

  const resume = await Resume.findOne({
    _id: req.params.resumeId,
    user: req.user._id,
  });

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  const project = resume.projects.id(req.params.projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (name !== undefined) project.name = name;
  if (description !== undefined) project.description = description;
  if (link !== undefined) project.link = link;
  if (technology !== undefined) project.technology = technology;

  await resume.save();

  return res
    .status(200)
    .json(new ApiResponse(200, resume, "Project updated successfully"));
});

const deleteProject = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({
    _id: req.params.resumeId,
    user: req.user._id,
  });

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  const initialLength = resume.projects.length;
  resume.projects = resume.projects.filter(
    (project) => project._id.toString() !== req.params.projectId
  );

  if (resume.projects.length === initialLength) {
    throw new ApiError(404, "Project not found to delete");
  }

  await resume.save();

  return res
    .status(200)
    .json(new ApiResponse(200, resume, "Project deleted successfully"));
});
export {
  createResume,
  getAllResume,
  getResumeById,
  updateResume,
  deleteResume,
  addproject,
  updateProject,
  deleteProject,
};
