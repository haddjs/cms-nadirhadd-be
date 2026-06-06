import { Request, Response } from "express";
import logger from "../config/logger";
import { getAllTechStacks } from "../models/tech_stack.model";

const getTechStacks = async (_req: Request, res: Response) => {
  try {
    const techStacks = await getAllTechStacks();
    res.json(techStacks);
  } catch (error) {
    logger.error("Error in getTechStacks controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { getTechStacks };
