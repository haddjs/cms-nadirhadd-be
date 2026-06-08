import { Router } from "express";
import upload from "../config/multer";
import {
  addProjectController,
  deleteProjectController,
  getProjectByIdController,
  getProjectImagesController,
  getProjectsController,
  updateProjectController,
} from "../controllers/project.controller";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.get("/", getProjectsController);
router.get("/images/:id", getProjectImagesController);
router.post(
  "/",
  authenticateToken,
  upload.array("images", 10),
  addProjectController,
);
router.get("/:id", getProjectByIdController);
router.delete("/:id", authenticateToken, deleteProjectController);
router.patch("/:id", authenticateToken, updateProjectController);

export default router;
