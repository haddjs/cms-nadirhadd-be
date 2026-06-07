import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import logger from "../config/logger";
import { uploadToCloudinary } from "../helper/uploadCloudinary";
import { getAbout, updateAbout } from "../models/about.model";
import { NotFoundError, ValidationError } from "../utils/AppError";

const getAboutController = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const about = await getAbout();
    logger.info("Fetching about");
    res.status(200).json(about);
  } catch (error) {
    next(error);
  }
};

const updateAboutController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const aboutId = req.params.id as string;
    if (Object.keys(req.body).length === 0)
      throw new ValidationError("No fields to update");

    if (req.file) {
      const curr = await getAbout();
      const currentPublicId = curr.profile_picture_public_id;

      if (currentPublicId) {
        await cloudinary.uploader.destroy(currentPublicId);
      }

      const uploadResult = await uploadToCloudinary(req.file.buffer);

      req.body.profile_picture = uploadResult.secure_url;
      req.body.profile_picture_public_id = uploadResult.public_id;
    }

    const update = await updateAbout(aboutId, req.body);
    if (!update) throw new NotFoundError("About not found");

    logger.info("Updating about");
    res.status(200).json({ message: "About updated!", data: { ...req.body } });
  } catch (error) {
    next(error);
  }
};

export { getAboutController, updateAboutController };
