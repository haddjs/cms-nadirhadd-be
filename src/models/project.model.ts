import pool from "../config/db";
import logger from "../config/logger";
import { AddProjectPayload } from "../types/project.types";

const getAllProjects = async () => {
  try {
    const res = await pool.query(
      "SELECT projects.id, projects.title, projects.description, projects.url, projects.github_url, projects.status, array_agg(DISTINCT tech_stacks.name) AS tech_stacks, json_agg(DISTINCT jsonb_build_object('image_url', project_images.image_url, 'is_thumbnail', project_images.is_thumbnail, 'public_id', project_images.public_id)) as images FROM projects LEFT JOIN project_tech_stacks ON projects.id = project_tech_stacks.project_id LEFT JOIN tech_stacks ON project_tech_stacks.tech_stack_id = tech_stacks.id LEFT JOIN project_images ON projects.id = project_images.project_id GROUP BY projects.id",
    );
    return res.rows;
  } catch (error) {
    logger.error("Error fetching projects:", error);
    throw error;
  }
};

const getProjectById = async (id: string) => {
  try {
    const res = await pool.query(
      "SELECT projects.id, projects.title, projects.description, projects.url, projects.github_url, projects.status, array_agg(DISTINCT tech_stacks.name) AS tech_stacks, json_agg(DISTINCT jsonb_build_object('image_url', project_images.image_url, 'is_thumbnail', project_images.is_thumbnail, 'public_id', project_images.public_id)) as images FROM projects LEFT JOIN project_tech_stacks ON projects.id = project_tech_stacks.project_id LEFT JOIN tech_stacks ON project_tech_stacks.tech_stack_id = tech_stacks.id LEFT JOIN project_images ON projects.id = project_images.project_id WHERE projects.id = $1 GROUP BY projects.id",
      [id],
    );
    return res.rows[0];
  } catch (error) {
    throw error;
  }
};

const getProjectImages = async (id: string) => {
  try {
    const res = await pool.query(
      "SELECT project_images.public_id FROM project_images WHERE project_images.project_id = $1",
      [id],
    );

    return res.rows;
  } catch (error) {
    throw error;
  }
};

const addProject = async (payload: AddProjectPayload) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const res = await client.query(
      "INSERT INTO projects (title, description, url, github_url, status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [
        payload.title,
        payload.description,
        payload.url,
        payload.github_url,
        payload.status,
      ],
    );

    const projectId = res.rows[0].id;

    for (const techStackName of payload.tech_stacks) {
      const techStackRes = await client.query(
        "SELECT id from tech_stacks WHERE name = $1",
        [techStackName],
      );
      let techStackId: string;
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
        "INSERT INTO project_tech_stacks (project_id, tech_stack_id) VALUES ($1, $2)",
        [projectId, techStackId],
      );
    }

    for (const image of payload.images) {
      await client.query(
        "INSERT INTO project_images (project_id, image_url, is_thumbnail, public_id) VALUES ($1, $2, $3, $4)",
        [projectId, image.image_url, image.is_thumbnail, image.public_id],
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

const deleteProject = async (id: string) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query("DELETE FROM project_images WHERE project_id = $1", [
      id,
    ]);

    await client.query(
      "DELETE FROM project_tech_stacks WHERE project_id = $1",
      [id],
    );

    await client.query("DELETE FROM projects WHERE id = $1", [id]);

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export {
  addProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  getProjectImages,
};
