import { Router } from "express";
import upload from "../config/multer";
import {
  getAboutController,
  updateAboutController,
} from "../controllers/about.controller";

const router = Router();

router.get("/", getAboutController);
router.patch("/:id", upload.single("image"), updateAboutController);

export default router;
