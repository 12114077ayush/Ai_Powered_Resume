import mongoose, { Schema } from "mongoose";

const resumeSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    title: { type: String, required: true }, // eg. "Frontend Developer Resume"
    summary: { type: String },
    skills: [String],
    experience: [
      {
        company: String,
        role: String,
        startDate: Date,
        endDate: Date,
        description: String,
      },
    ],
    education: [
      {
        institution: String,
        degree: String,
        year: String,
      },
    ],
    projects: [
      {
        title: String,
        description: String,
        link: String,
        technologies: [String],
      },
    ],
    aiGenerated: { type: Boolean, default: false },
    sourceJobDescription: { type: String },
    lastEdited: { type: Date, default: Date.now },
    cloudinaryURL: {
      type: String,
    },
    public_id: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Resume = mongoose.model("Resume", resumeSchema);
