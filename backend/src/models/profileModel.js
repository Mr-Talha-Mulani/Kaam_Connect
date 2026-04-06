const pool = require('../config/db');

class ProfileModel {
  // Job Seeker Profile
  static async createJobSeekerProfile(userId, skills, age, location, phoneNumber, qualification) {
    const query = `
      INSERT INTO job_seeker_profiles (user_id, skills, age, location, phone_number, qualification)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [userId, skills, age, location, phoneNumber, qualification];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findJobSeekerProfileByUserId(userId) {
    const query = 'SELECT * FROM job_seeker_profiles WHERE user_id = $1';
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  // Employer Profile
  static async createEmployerProfile(userId, name, location, businessDescription, phoneNumber) {
    const query = `
      INSERT INTO employer_profiles (user_id, name, location, business_description, phone_number)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [userId, name, location, businessDescription, phoneNumber];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findEmployerProfileByUserId(userId) {
    const query = 'SELECT * FROM employer_profiles WHERE user_id = $1';
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }
}

module.exports = ProfileModel;