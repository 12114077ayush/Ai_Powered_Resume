// middlewares/multer.middleware.js
import multer from "multer";
import path from "path";

// Save file temporarily on disk
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../../public/temp"); // make sure this folder exists
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Allow only PDFs and DOCX
const fileFilter = (req, file, cb) => {
  const allowedTypes = [".pdf", ".doc", ".docx"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and Word documents are allowed"));
  }
};

const upload = multer({ storage, fileFilter });

export { upload };
