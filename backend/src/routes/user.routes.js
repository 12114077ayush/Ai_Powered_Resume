import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  updateAccount,
  updatePassword,
} from "../controllers/user.controller.js";
const router = Router();
import { verifyJWT } from "../middlewares/auth.middleware.js";

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/update-account").post(verifyJWT, updateAccount);
router.route("/update-password").post(verifyJWT, updatePassword);
export default router;
