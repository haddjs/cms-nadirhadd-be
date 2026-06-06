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

const router = Router();

router.get("/", getProjectsController);
router.get("/images/:id", getProjectImagesController);
router.post("/", upload.array("images", 10), addProjectController);
router.get("/:id", getProjectByIdController);
router.delete("/:id", deleteProjectController);
router.patch("/:id", updateProjectController);

export default router;
