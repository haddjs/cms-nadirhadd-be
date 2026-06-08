import { Router } from "express";
import upload from "../config/multer";
import {
  getAboutController,
  updateAboutController,
} from "../controllers/about.controller";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.get("/", getAboutController);
router.patch(
  "/:id",
  authenticateToken,
  upload.single("image"),
  updateAboutController,
);

export default router;
