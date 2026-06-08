import { Router } from "express";
import {
  addExperienceController,
  deleteExperienceController,
  getExperienceByIdController,
  getExperiencesController,
  updateExperienceController,
} from "../controllers/experience.controller";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.get("/", getExperiencesController);
router.get("/:id", getExperienceByIdController);
router.post("/", authenticateToken, addExperienceController);
router.patch("/:id", authenticateToken, updateExperienceController);
router.delete("/:id", authenticateToken, deleteExperienceController);

export default router;
