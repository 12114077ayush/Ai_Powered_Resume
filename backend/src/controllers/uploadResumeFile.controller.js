import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadResumeFile = async (req, res) => {
  try {
    if (!req.file) {
      throw new ApiError(400, "No file uploaded");
    }

    const resumeId = req.params.resumeId;

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw", // use 'raw' for non-image files
      folder: "resumes",
    });

    // Remove file from local uploads folder
    fs.unlinkSync(req.file.path);

    // Update Resume document with Cloudinary URL and public ID
    const resume = await Resume.findOneAndUpdate(
      { _id: resumeId, user: req.user._id },
      {
        cloudinaryURL: result.secure_url,
        cloudinaryPublicId: result.public_id,
      },
      { new: true }
    );

    if (!resume) {
      throw new ApiError(404, "Resume not found");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          resume,
          "Resume file uploaded and saved successfully"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Failed to upload resume", error));
  }
};

export { uploadResumeFile };
