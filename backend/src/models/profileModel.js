const pool = require('../config/db');

class JobSeekerProfileModel {
  static async create(userId, data) {
    const {
      full_name, date_of_birth, phone_number, secondary_phone,
      residential_address, city, pincode,
      id_proof_type, id_proof_last4,
      primary_skill, primary_skill_level, years_of_experience,
      secondary_skills, languages_known, certifications,
      work_type_preference, available_days_per_week, preferred_hours,
      can_start_immediately, availability_duration,
      can_lift_weight, preferred_communication, language_preference,
      qualification, location,
      declares_age_18_plus, declares_info_accurate,
      declares_no_criminal_history, consents_to_terms, consents_to_background_check,
    } = data;

    const query = `
      INSERT INTO job_seeker_profiles (
        user_id, full_name, date_of_birth, phone_number, secondary_phone,
        residential_address, city, pincode,
        id_proof_type, id_proof_last4,
        primary_skill, primary_skill_level, years_of_experience,
        secondary_skills, languages_known, certifications,
        work_type_preference, available_days_per_week, preferred_hours,
        can_start_immediately, availability_duration,
        can_lift_weight, preferred_communication, language_preference,
        qualification, location,
        declares_age_18_plus, declares_info_accurate,
        declares_no_criminal_history, consents_to_terms, consents_to_background_check
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31
      ) RETURNING *;
    `;
    const values = [
      userId, full_name, date_of_birth, phone_number, secondary_phone,
      residential_address, city, pincode,
      id_proof_type, id_proof_last4,
      primary_skill, primary_skill_level, years_of_experience,
      secondary_skills, languages_known, certifications,
      work_type_preference, available_days_per_week, preferred_hours,
      can_start_immediately, availability_duration,
      can_lift_weight, preferred_communication, language_preference,
      qualification, location,
      declares_age_18_plus, declares_info_accurate,
      declares_no_criminal_history, consents_to_terms, consents_to_background_check,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const query = `
      SELECT jsp.*, u.name, u.email, u.role, u.verification_status
      FROM job_seeker_profiles jsp
      JOIN users u ON jsp.user_id = u.id
      WHERE jsp.user_id = $1
    `;
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  static async update(userId, data) {
    const keys = Object.keys(data || {});
    if (keys.length === 0) {
      return this.findByUserId(userId);
    }
    const fields = keys.map((k, i) => `${k} = $${i + 2}`).join(', ');
    const query = `UPDATE job_seeker_profiles SET ${fields}, updated_at = NOW() WHERE user_id = $1 RETURNING *`;
    const result = await pool.query(query, [userId, ...keys.map((k) => data[k])]);
    return result.rows[0];
  }

  static async updateRating(userId, newRating) {
    const query = `
      UPDATE job_seeker_profiles
      SET avg_rating = (avg_rating * total_reviews + $2) / (total_reviews + 1),
          total_reviews = total_reviews + 1,
          updated_at = NOW()
      WHERE user_id = $1
      RETURNING *;
    `;
    const result = await pool.query(query, [userId, newRating]);
    return result.rows[0];
  }
}

class EmployerProfileModel {
  static async create(userId, data) {
    const {
      owner_name, owner_dob, owner_phone, owner_email, owner_address,
      owner_id_proof_type, owner_id_proof_last4,
      name, business_type, industry, years_in_operation, num_employees,
      business_registration_number, gst_number,
      business_address, city, pincode, landmark,
      business_phone, business_email, website,
      alternative_contact_name, alternative_contact_phone,
      business_description,
      payment_method, payment_frequency,
      complies_minimum_wage, provides_safe_environment,
      no_child_labor, no_discrimination, respects_worker_rights, consents_to_terms,
      location,
    } = data;

    const query = `
      INSERT INTO employer_profiles (
        user_id, owner_name, owner_dob, owner_phone, owner_email, owner_address,
        owner_id_proof_type, owner_id_proof_last4,
        name, business_type, industry, years_in_operation, num_employees,
        business_registration_number, gst_number,
        business_address, city, pincode, landmark,
        business_phone, business_email, website,
        alternative_contact_name, alternative_contact_phone,
        business_description,
        payment_method, payment_frequency,
        complies_minimum_wage, provides_safe_environment,
        no_child_labor, no_discrimination, respects_worker_rights, consents_to_terms,
        phone_number, location
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$4,$34
      ) RETURNING *;
    `;
    const values = [
      userId, owner_name, owner_dob, owner_phone, owner_email, owner_address,
      owner_id_proof_type, owner_id_proof_last4,
      name, business_type, industry, years_in_operation, num_employees,
      business_registration_number, gst_number,
      business_address, city, pincode, landmark,
      business_phone, business_email, website,
      alternative_contact_name, alternative_contact_phone,
      business_description,
      payment_method, payment_frequency,
      complies_minimum_wage, provides_safe_environment,
      no_child_labor, no_discrimination, respects_worker_rights, consents_to_terms,
      location,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const query = `
      SELECT ep.*, u.name, u.email, u.role, u.verification_status
      FROM employer_profiles ep
      JOIN users u ON ep.user_id = u.id
      WHERE ep.user_id = $1
    `;
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  static async update(userId, data) {
    const keys = Object.keys(data || {});
    if (keys.length === 0) {
      return this.findByUserId(userId);
    }
    const fields = keys.map((k, i) => `${k} = $${i + 2}`).join(', ');
    const query = `UPDATE employer_profiles SET ${fields}, updated_at = NOW() WHERE user_id = $1 RETURNING *`;
    const result = await pool.query(query, [userId, ...keys.map((k) => data[k])]);
    return result.rows[0];
  }

  // Flexible upsert — only sets fields that are provided
  static async upsert(userId, data) {
    const keys = Object.keys(data);
    if (keys.length === 0) {
      // Create a minimal row
      const result = await pool.query(
        `INSERT INTO employer_profiles (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING RETURNING *`,
        [userId]
      );
      return result.rows[0] || (await pool.query('SELECT * FROM employer_profiles WHERE user_id=$1', [userId])).rows[0];
    }
    const insertCols = ['user_id', ...keys].join(', ');
    const insertPlaceholders = ['$1', ...keys.map((_, i) => `$${i + 2}`)].join(', ');
    const updateClauses = keys.map((k, i) => `${k} = $${i + 2}`).join(', ');
    const query = `
      INSERT INTO employer_profiles (${insertCols})
      VALUES (${insertPlaceholders})
      ON CONFLICT (user_id) DO UPDATE SET ${updateClauses}, updated_at = NOW()
      RETURNING *
    `;
    const result = await pool.query(query, [userId, ...Object.values(data)]);
    return result.rows[0];
  }
}

module.exports = { JobSeekerProfileModel, EmployerProfileModel };