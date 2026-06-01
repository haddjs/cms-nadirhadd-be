import pool from "../config/db";

const getAllTechStacks = async () => {
    try {
        const res = await pool.query("SELECT * FROM tech_stacks");
        return res.rows;
    } catch (error) {
        console.error("Error fetching tech stacks:", error);
        throw error;
    }
}

export { getAllTechStacks }