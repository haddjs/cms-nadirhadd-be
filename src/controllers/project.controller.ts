import { Request, Response } from "express";
import logger from "../config/logger";
import { uploadToCloudinary } from "../helper/uploadCloudinary";
import { addProject, getAllProjects } from "../models/project.model";

const getProjectsController = async (_req: Request, res: Response) => {
  try {
    const projects = await getAllProjects();
    res.status(200).json(projects);
  } catch (error) {
    logger.error("Error in getProjects controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addProjectController = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No images inputted" });
    }

    const uploadedImages = [];
    for (const file of files) {
      const uploadResult = await uploadToCloudinary(file.buffer);
      uploadedImages.push({
        image_url: uploadResult.secure_url,
        is_thumbnail: files.indexOf(file) === 0,
        public_id: uploadResult.public_id,
      });
    }

    const tech_stacks = JSON.parse(req.body.tech_stacks);

    const newProject = await addProject({
      ...req.body,
      tech_stacks,
      images: uploadedImages,
    });
    res
      .status(201)
      .json({ message: "Project added successfully", project: newProject });
  } catch (error) {
    logger.error("Error in addProject controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { addProjectController, getProjectsController };
