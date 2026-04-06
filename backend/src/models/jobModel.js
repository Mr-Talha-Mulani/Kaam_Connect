const pool = require('../config/db');

class JobModel {
  static async createJob(jobData) {
    const { title, description, salary, skills_required, qualification_required, location, vacancies, employer_id } = jobData;
    const query = `
      INSERT INTO jobs (title, description, salary, skills_required, qualification_required, location, vacancies, status, employer_id, created_at)
      VALUES ($1, $2, $3, $4, $5, LOWER($6), $7, 'open', $8, NOW())
      RETURNING *;
    `;
    const values = [title, description, salary, skills_required, qualification_required, location, vacancies, employer_id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getJobsByEmployer(employerId) {
    const query = 'SELECT * FROM jobs WHERE employer_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [employerId]);
    return result.rows;
  }

  static async getJobById(jobId) {
    const query = 'SELECT * FROM jobs WHERE id = $1';
    const result = await pool.query(query, [jobId]);
    return result.rows[0];
  }

  static async updateJob(jobId, jobData) {
    const { title, description, salary, skills_required, qualification_required, location, vacancies, status } = jobData;
    const query = `
      UPDATE jobs
      SET title = $1, description = $2, salary = $3, skills_required = $4, qualification_required = $5, location = LOWER($6), vacancies = $7, status = $8, updated_at = NOW()
      WHERE id = $9
      RETURNING *;
    `;
    const values = [title, description, salary, skills_required, qualification_required, location, vacancies, status, jobId];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async deleteJob(jobId) {
    const query = 'DELETE FROM jobs WHERE id = $1';
    await pool.query(query, [jobId]);
  }

  static async getJobsForJobSeeker(jobSeekerLocation) {
    const query = `
      SELECT j.*, ep.name as employer_name, ep.phone_number as employer_phone_number, u.email as employer_email
      FROM jobs j
      JOIN employer_profiles ep ON j.employer_id = ep.user_id
      JOIN users u ON j.employer_id = u.id
      WHERE j.location ILIKE $1 AND j.status = 'open'
      ORDER BY j.created_at DESC;
    `;
    const result = await pool.query(query, [`%${jobSeekerLocation.toLowerCase()}%`]);
    return result.rows;
  }
}

module.exports = JobModel;