const pool = require('../config/db');

class UserModel {
  static async createUser(name, email, password, role, location) {
    const query = `
      INSERT INTO users (name, email, password, role, location, is_profile_completed, created_at)
      VALUES ($1, $2, $3, $4, $5, false, NOW())
      RETURNING id, name, email, role, location, is_profile_completed;
    `;
    const values = [name, email, password, role, location];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findUserByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findUserById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async updateProfileCompleted(userId) {
    const query = 'UPDATE users SET is_profile_completed = true WHERE id = $1';
    await pool.query(query, [userId]);
  }
}

module.exports = UserModel;