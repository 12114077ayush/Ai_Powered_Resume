import fs from "fs";
import PDFDocument from "pdfkit";
import cloudinary from "../utils/cloudinary.js";
import { Resume } from "../models/resume.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const exportResumeToPDFAndUpload = async (req, res) => {
  try {
    const resumeId = req.params.resumeId;

    // Fetch resume from DB
    const resume = await Resume.findOne({
      _id: resumeId,
      user: req.user._id,
    });

    if (!resume) {
      throw new ApiError(404, "Resume not found");
    }

    // Generate PDF from resume data
    const doc = new PDFDocument();
    const tempFilePath = `temp-resume-${resumeId}.pdf`;
    const writeStream = fs.createWriteStream(tempFilePath);
    doc.pipe(writeStream);

    // Dummy content – you can format as needed
    doc.fontSize(20).text(`Resume: ${resume.fullName || "N/A"}`, {
      align: "center",
    });

    doc
      .moveDown()
      .fontSize(12)
      .text(`Email: ${resume.email || "N/A"}`);
    doc.text(`Projects: ${resume.projects?.length || 0}`);
    doc.text(`Education Entries: ${resume.education?.length || 0}`);
    doc.text(`Skills: ${resume.skills?.join(", ") || "None"}`);

    doc.end();

    // Wait for file write to complete
    await new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    // console.log("cloudinary.uploader:", cloudinary.uploader);

    // Upload PDF to Cloudinary
    const result = await cloudinary.uploader.upload(tempFilePath, {
      resource_type: "auto",
      folder: "resumes",
    });

    // Remove local temp file
    fs.unlinkSync(tempFilePath);

    // Update resume with cloudinary info
    resume.cloudinaryURL = result.secure_url;
    resume.cloudinaryPublicId = result.public_id;
    await resume.save();

    return res
      .status(200)
      .json(
        new ApiResponse(200, resume, "Resume exported to PDF and uploaded")
      );
  } catch (error) {
    console.error("PDF Upload Error:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Failed to export and upload resume"));
  }
};

export { exportResumeToPDFAndUpload };
