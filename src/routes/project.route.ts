import { Router } from "express";
import upload from '../config/multer'
import { uploadTestController } from "../controllers/uploadtest.controller";

const router = Router();

router.post('/upload-post', upload.single('image'), uploadTestController)

export default router;