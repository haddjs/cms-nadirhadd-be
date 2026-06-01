import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const testConnection = async () => {
    try {
        const client = await pool.connect();
        console.log("Database connected!")
        client.release();
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1);
    }
}

testConnection();

export default pool;