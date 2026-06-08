import { Router } from "express";
import { login, logout } from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.post("/login", login);
router.post("/logout", authenticateToken, logout);

export default router;
