import { Router } from "express";
import upload from "../config/multer";
import {
  addProjectController,
  deleteProjectController,
  getProjectByIdController,
  getProjectImagesController,
  getProjectsController,
} from "../controllers/project.controller";

const router = Router();

router.post("/", upload.array("images", 10), addProjectController);
router.get("/", getProjectsController);
router.get("/:id", getProjectByIdController);
router.get("/images/:id", getProjectImagesController);
router.delete("/:id", deleteProjectController);

export default router;
