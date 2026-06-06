import { Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import logger from "../config/logger";
import { uploadToCloudinary } from "../helper/uploadCloudinary";
import {
  addProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  getProjectImages,
  updateProject,
} from "../models/project.model";

const getProjectsController = async (_req: Request, res: Response) => {
  try {
    const projects = await getAllProjects();
    res.status(200).json(projects);
  } catch (error) {
    logger.error("Error in getProjects controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getProjectByIdController = async (req: Request, res: Response) => {
  try {
    const project = await getProjectById(req.params.id as string);
    res.status(200).json(project);
  } catch (error) {
    logger.error("Error in getProjectById controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getProjectImagesController = async (req: Request, res: Response) => {
  try {
    const images = await getProjectImages(req.params.id as string);
    res.status(200).json(images);
  } catch (error) {
    logger.error("Error fetching images from projects", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addProjectController = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No images inputted" });
    }

    const uploadedImages = await Promise.all(
      files.map(async (file, index) => {
        const uploadResult = await uploadToCloudinary(file.buffer);
        return {
          image_url: uploadResult.secure_url,
          is_thumbnail: index === 0,
          public_id: uploadResult.public_id,
        };
      }),
    );

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

const deleteProjectController = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.id as string;
    const images = await getProjectImages(projectId);

    if (images && images.length > 0) {
      await Promise.allSettled(
        images.map((image) => cloudinary.uploader.destroy(image.public_id)),
      );
    }

    await deleteProject(projectId);

    res.status(200).json({ message: "Project deletion success!" });
  } catch (error) {
    logger.error("Error in deleteProject controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateProjectController = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.id as string;

    const payload = {
      ...req.body,
      tech_stacks: req.body.tech_stacks
        ? JSON.parse(req.body.tech_stacks)
        : undefined,
    };

    await updateProject(projectId, payload);
    res
      .status(200)
      .json({ message: "Projects updated!", data: { projectId, ...req.body } });
  } catch (error) {
    logger.error("Error in updateProject controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export {
  addProjectController,
  deleteProjectController,
  getProjectByIdController,
  getProjectImagesController,
  getProjectsController,
  updateProjectController,
};
