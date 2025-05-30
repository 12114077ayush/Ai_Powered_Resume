import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    //(this app.use is generlly come into use with middleware)
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // here we config to get data from URL.
app.use(express.static("public"));

//import routes
import userRouter from "./routes/user.routes.js";
import resumeRouter from "./routes/resume.routes.js";
import aiRouter from "./routes/ai.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/resumes", resumeRouter);
app.use("/api/v1/ai", aiRouter);
export { app };
