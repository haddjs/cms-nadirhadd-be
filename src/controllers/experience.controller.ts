import { Request, Response } from "express";
import logger from "../config/logger";
import {
  addExperience,
  deleteExperience,
  getAllExperiences,
  getExperienceById,
  updateExperience,
} from "../models/experience.model";

const getExperiencesController = async (_req: Request, res: Response) => {
  try {
    const experiences = await getAllExperiences();
    res.status(200).json(experiences);
  } catch (error) {
    logger.error("Error in getExperiences controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getExperienceByIdController = async (req: Request, res: Response) => {
  try {
    const experience = await getExperienceById(req.params.id as string);
    if (!experience)
      return res.status(404).json({ error: "Experience not found!" });
    res.status(200).json({ message: "Data fetched!", data: experience });
  } catch (error) {
    logger.error("Error in getExperienceById controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addExperienceController = async (req: Request, res: Response) => {
  try {
    if (!req.body.company_name || !req.body.role || !req.body.start_date) {
      return res.status(400).json({
        error: "Missing required fields: company_name, role, start_date",
      });
    }

    const newExperience = await addExperience(req.body);

    res.status(201).json({ message: "Experience added!", data: newExperience });
  } catch (error) {
    logger.error("Error in addExperience controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateExperienceController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await updateExperience(id, req.body);
    res
      .status(200)
      .json({ message: "Experience updated!", data: { id, ...req.body } });
  } catch (error) {
    logger.error("Error in updateExperience controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteExperienceController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await deleteExperience(id);
    res.status(200).json({ message: "Experience deleted!", data: { id } });
  } catch (error) {
    logger.error("Error in deleteExperience controller:", error);
    res.status(500).json({ error: "Internal serveer Error" });
  }
};

export {
  addExperienceController,
  deleteExperienceController,
  getExperienceByIdController,
  getExperiencesController,
  updateExperienceController,
};
