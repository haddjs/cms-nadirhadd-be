import pool from "../config/db";
import type { UpdateAboutPayload } from "../types/about.types";

const getAbout = async () => {
  try {
    const res = await pool.query(
      "SELECT about.id, about.name, about.role, about.bio, about.profile_picture, about.profile_picture_public_id, about.cv_url, about.status FROM about",
    );

    return res.rows[0];
  } catch (error) {
    throw error;
  }
};

const updateAbout = async (id: string, payload: UpdateAboutPayload) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const fields = [];
    const values = [];
    let index: number = 1;

    for (const key in payload) {
      if (payload[key as keyof UpdateAboutPayload] !== undefined) {
        fields.push(`${key} = $${index}`);
        values.push(payload[key as keyof UpdateAboutPayload]);
        index++;
      }
    }

    if (fields.length > 0) {
      const res = await client.query(
        `UPDATE about SET ${fields.join(", ")} WHERE id = $${index} RETURNING id`,
        [...values, id],
      );

      await client.query("COMMIT");
      return res.rows[0];
    }

    return { ...payload };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export { getAbout, updateAbout };
