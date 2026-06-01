import { getTechStacks } from "../controllers/tech_stack.controller";
import { Router } from "express";

const router = Router();

router.get('/', getTechStacks);

export default router;