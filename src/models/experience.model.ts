import pool from "../config/db";
import {
  AddExperiencePayload,
  UpdateExperiencePayload,
} from "../types/experience.types";

const getAllExperiences = async () => {
  try {
    const res = await pool.query(
      "SELECT experiences.id, experiences.company_name, experiences.role, experiences.start_date, experiences.end_date, experiences.description, array_agg(tech_stacks.name) AS tech_stacks FROM experiences LEFT JOIN experience_tech_stacks ON experiences.id = experience_tech_stacks.experience_id LEFT JOIN tech_stacks ON experience_tech_stacks.tech_stack_id = tech_stacks.id GROUP BY experiences.id",
    );
    return res.rows;
  } catch (error) {
    throw error;
  }
};

const getExperienceById = async (id: string) => {
  try {
    const res = await pool.query(
      "SELECT experiences.id, experiences.company_name, experiences.role, experiences.start_date, experiences.end_date, experiences.description, array_agg(tech_stacks.name) AS tech_stacks FROM experiences LEFT JOIN experience_tech_stacks ON experiences.id = experience_tech_stacks.experience_id LEFT JOIN tech_stacks ON experience_tech_stacks.tech_stack_id = tech_stacks.id WHERE experiences.id = $1 GROUP BY experiences.id",
      [id],
    );
    return res.rows[0];
  } catch (error) {
    throw error;
  }
};

const addExperience = async (payload: AddExperiencePayload) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const res = await client.query(
      "INSERT INTO experiences (company_name, role, start_date, end_date, description) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [
        payload.company_name,
        payload.role,
        payload.start_date,
        payload.end_date,
        payload.description,
      ],
    );

    const experienceId = res.rows[0].id;

    for (const techStackName of payload.tech_stacks) {
      const techStackRes = await client.query(
        "SELECT id FROM tech_stacks WHERE name = $1",
        [techStackName],
      );
      let techStackId;
      if (techStackRes.rows.length > 0) {
        techStackId = techStackRes.rows[0].id;
      } else {
        const insertTechStackRes = await client.query(
          "INSERT INTO tech_stacks (name) VALUES ($1) RETURNING id",
          [techStackName],
        );
        techStackId = insertTechStackRes.rows[0].id;
      }

      await client.query(
        "INSERT INTO experience_tech_stacks (experience_id, tech_stack_id) VALUES ($1, $2)",
        [experienceId, techStackId],
      );
    }
    await client.query("COMMIT");

    return res.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const updateExperience = async (
  id: string,
  payload: UpdateExperiencePayload,
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const fields = [];
    const values = [];
    let index = 1;

    for (const key in payload) {
      if (payload[key as keyof UpdateExperiencePayload] !== undefined) {
        fields.push(`${key} = $${index}`);
        values.push(payload[key as keyof UpdateExperiencePayload]);
        index++;
      }
    }

    if (fields.length > 0) {
      const res = await client.query(
        `UPDATE experiences SET ${fields.join(", ")} WHERE id = $${index} RETURNING id`,
        [...values, id],
      );

      return res.rows[0];
    }

    await client.query("COMMIT");

    return { ...payload };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const deleteExperience = async (id: string) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(
      "DELETE FROM experience_tech_stacks WHERE experience_id = $1",
      [id],
    );
    const deleteProjectRes = await client.query(
      "DELETE FROM experiences WHERE id = $1 RETURNING id",
      [id],
    );

    await client.query("COMMIT");

    return deleteProjectRes.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export {
  addExperience,
  deleteExperience,
  getAllExperiences,
  getExperienceById,
  updateExperience,
};
