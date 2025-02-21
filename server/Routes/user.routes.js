import express from "express";
import {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
} from "../Controllers/user.controller.js";
import { protect } from "../Middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", registerUser);
router.post("/login", authUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile",  updateUserProfile);
router.put("/change-password", protect, changePassword);

export default router;
