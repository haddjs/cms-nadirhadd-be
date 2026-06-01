import { Router } from "express";
import experienceRouter from './experience.route'
import techStackRouter from './tech_stack.route'
import projectRouter from './project.route';

const router = Router();

router.use('/experiences', experienceRouter);
router.use('/tech_stacks', techStackRouter);
router.use('/projects', projectRouter);

export default router;