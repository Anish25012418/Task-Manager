import express from 'express';
import {
  deleteUserProfile,
  getUserProfile,
  loginUser,
  registerUser,
  updateUserProfile,
  uploadUserProfileImage
} from "../controllers/authController.js";
import {protect} from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

//Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.delete("/profile", protect, deleteUserProfile);

router.post("/upload-image", upload.single("image"), uploadUserProfileImage);

export default router;