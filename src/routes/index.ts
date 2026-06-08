import { Router } from "express";
import aboutRouter from "./about.route";
import authRouter from "./auth.route";
import experienceRouter from "./experience.route";
import projectRouter from "./project.route";
import techStackRouter from "./tech_stack.route";

const router = Router();

router.use("/experiences", experienceRouter);
router.use("/tech_stacks", techStackRouter);
router.use("/projects", projectRouter);
router.use("/about", aboutRouter);
router.use("/auth", authRouter);

export default router;
