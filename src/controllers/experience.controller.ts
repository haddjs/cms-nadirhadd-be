import { NextFunction, Request, Response } from "express";
import logger from "../config/logger";
import {
  addExperience,
  deleteExperience,
  getAllExperiences,
  getExperienceById,
  updateExperience,
} from "../models/experience.model";
import { NotFoundError, ValidationError } from "../utils/AppError";

const getExperiencesController = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const experiences = await getAllExperiences();
    logger.info("Fetching all experiences");
    res.status(200).json(experiences);
  } catch (error) {
    next(error);
  }
};

const getExperienceByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const experienceId = req.params.id as string;
    const experience = await getExperienceById(experienceId);
    if (!experience) throw new NotFoundError("This experience doesn't exist");
    logger.info(`Experience with ${experienceId} fetched`);
    res.status(200).json({ message: "Data fetched!", data: experience });
  } catch (error) {
    next(error);
  }
};

const addExperienceController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.body.company_name || !req.body.role || !req.body.start_date) {
      throw new ValidationError(
        "Missing required fields: company_name, role, start_date",
      );
    }

    const newExperience = await addExperience(req.body);

    logger.info("Adding experience");
    res.status(201).json({ message: "Experience added!", data: newExperience });
  } catch (error) {
    next(error);
  }
};

const updateExperienceController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;
    if (Object.keys(req.body).length === 0) {
      throw new ValidationError("No fields to update");
    }

    const updated = await updateExperience(id, req.body);
    if (!updated) throw new NotFoundError("Experience not found");

    logger.info(`Updating experience ${id}`);
    res
      .status(200)
      .json({ message: "Experience updated!", data: { id, ...req.body } });
  } catch (error) {
    next(error);
  }
};

const deleteExperienceController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;
    const deleted = await deleteExperience(id);
    if (!deleted) throw new NotFoundError("Experience not found");
    logger.info(`Deleting experience ${id}`);
    res.status(200).json({ message: "Experience deleted!", data: { id } });
  } catch (error) {
    next(error);
  }
};

export {
  addExperienceController,
  deleteExperienceController,
  getExperienceByIdController,
  getExperiencesController,
  updateExperienceController,
};
