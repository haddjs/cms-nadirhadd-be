import { getExperiencesController, getExperienceByIdController, addExperienceController, updateExperienceController, deleteExperienceController } from "../controllers/experience.controller";
import { Router } from "express";

const router = Router();

router.get('/', getExperiencesController);
router.get('/:id', getExperienceByIdController);
router.post('/', addExperienceController);
router.patch('/:id', updateExperienceController);
router.delete('/:id', deleteExperienceController);

export default router;