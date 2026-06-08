import { NextFunction, Request, Response } from "express";
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
import { NotFoundError, ValidationError } from "../utils/AppError";

const getProjectsController = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const projects = await getAllProjects();
    logger.info("Fetching projects");
    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

const getProjectByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const projectId = req.params.id as string;
    const project = await getProjectById(req.params.id as string);
    if (!project) throw new NotFoundError("Project not found");

    logger.info(`Fetching project ${projectId}`);
    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
};

const getProjectImagesController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const images = await getProjectImages(req.params.id as string);
    if (!images || images.length === 0)
      throw new NotFoundError("Image(s) not found");
    logger.info("Fetching images");
    res.status(200).json(images);
  } catch (error) {
    next(error);
  }
};

const addProjectController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      throw new ValidationError("No images inputted");
    }

    const uploadedImages: {
      image_url: string;
      is_thumbnail: boolean;
      public_id: string;
    }[] = [];

    for (let i = 0; i < files.length; i++) {
      const uploadResult = await uploadToCloudinary(files[i].buffer);
      logger.info(`${files[i]}: ${files[i].originalname}`);
      uploadedImages.push({
        image_url: uploadResult.secure_url,
        is_thumbnail: i === 0,
        public_id: uploadResult.public_id,
      });
    }

    const tech_stacks = JSON.parse(req.body.tech_stacks);

    const newProject = await addProject({
      ...req.body,
      tech_stacks,
      images: uploadedImages,
    });

    logger.info("Adding project");
    res
      .status(201)
      .json({ message: "Project added successfully", project: newProject });
  } catch (error) {
    next(error);
  }
};

const deleteProjectController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const projectId = req.params.id as string;
    const images = await getProjectImages(projectId);

    if (images && images.length > 0) {
      await Promise.allSettled(
        images.map((image) => cloudinary.uploader.destroy(image.public_id)),
      );
    }

    const deleted = await deleteProject(projectId);
    if (!deleted) throw new NotFoundError("Project does not exist.");

    logger.info(`Deleting project ${projectId}`);
    res.status(200).json({ message: "Project deletion success!" });
  } catch (error) {
    next(error);
  }
};

const updateProjectController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const projectId = req.params.id as string;

    const payload = {
      ...req.body,
      tech_stacks: req.body.tech_stacks
        ? JSON.parse(req.body.tech_stacks)
        : undefined,
    };

    if (Object.keys(req.body).length === 0) {
      throw new ValidationError("No fields updated");
    }

    const updated = await updateProject(projectId, payload);
    if (!updated) throw new NotFoundError("Project not found");
    logger.info(`Updating project ${projectId}`);
    res
      .status(200)
      .json({ message: "Projects updated!", data: { projectId, ...req.body } });
  } catch (error) {
    next(error);
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
