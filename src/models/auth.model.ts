import pool from "../config/db";

const getUserByEmail = async (username: string) => {
  try {
    const res = await pool.query(
      "SELECT users.id, users.username, users.password FROM users WHERE users.username = $1",
      [username],
    );

    return res.rows[0];
  } catch (error) {
    throw error;
  }
};

export { getUserByEmail };
