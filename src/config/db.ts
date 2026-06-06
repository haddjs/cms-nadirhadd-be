import { Pool } from "pg";
import logger from "./logger";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const testConnection = async () => {
  try {
    const client = await pool.connect();
    logger.info("Database connected!");
    client.release();
  } catch (error) {
    logger.error("Database connection error:", error);
    process.exit(1);
  }
};

testConnection();

export default pool;
