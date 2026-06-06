import pool from "../config/db";
import logger from "../config/logger";

const getAllTechStacks = async () => {
  try {
    const res = await pool.query("SELECT * FROM tech_stacks");
    return res.rows;
  } catch (error) {
    throw error;
  }
};

export { getAllTechStacks };
