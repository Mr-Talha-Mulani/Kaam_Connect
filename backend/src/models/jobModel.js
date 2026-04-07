const pool = require('../config/db');

class JobModel {
  static async create(data) {
    const {
      employer_id,
      title,
      description,
      category = null,
      job_type = 'full_time',
      location,
      salary = null,
      salary_min = null,
      salary_max = null,
      skills_required = null,
      qualification_required = 'any',
      vacancies = 1,
      is_urgent = false,
    } = data;

    const query = `
      INSERT INTO jobs (
        employer_id, title, description, category, job_type,
        location, salary_min, salary_max, salary,
        skills_required, qualification_required, vacancies,
        is_urgent, status
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'open'
      ) RETURNING *;
    `;
    const values = [
      employer_id,
      title,
      description,
      category,
      job_type,
      location,
      salary_min,
      salary_max,
      salary,
      skills_required,
      qualification_required,
      vacancies,
      is_urgent,
    ];
    const result = await pool.query(query, values);

    // Best-effort stats update; do not fail job creation if profile row is absent.
    await pool.query('UPDATE employer_profiles SET jobs_posted = COALESCE(jobs_posted, 0) + 1 WHERE user_id = $1', [employer_id]);
    return result.rows[0];
  }

  static async findById(jobId) {
    const query = `
            SELECT j.*, COALESCE(NULLIF(ep.name, ''), 'Company Confidential') as employer_name, ep.business_phone as employer_phone,
             ep.city as employer_city, ep.industry as employer_industry,
             ep.avg_rating as employer_rating, ep.years_in_operation,
              u.email as employer_email
      FROM jobs j
            LEFT JOIN employer_profiles ep ON j.employer_id = ep.user_id
      JOIN users u ON j.employer_id = u.id
      WHERE j.id = $1
    `;
    const result = await pool.query(query, [jobId]);
    return result.rows[0];
  }

  static async findByEmployer(employerId) {
    const query = `
      SELECT j.*, 
        (SELECT COUNT(*) FROM job_applications ja WHERE ja.job_id = j.id) as applications_count
      FROM jobs j
      WHERE j.employer_id = $1
      ORDER BY j.created_at DESC
    `;
    const result = await pool.query(query, [employerId]);
    return result.rows;
  }

  // Public search with filters - for anyone to browse (even unauthenticated for public browse)
  static async search(filters = {}) {
    const { q, location, category, job_type, salary_min, salary_max, status = 'open' } = filters;
    const params = [status];
    const conditions = [`j.status = $1`];
    let idx = 2;

    if (q) {
      conditions.push(`(j.title ILIKE $${idx} OR j.description ILIKE $${idx} OR j.skills_required ILIKE $${idx} OR j.category ILIKE $${idx})`);
      params.push(`%${q}%`);
      idx++;
    }
    if (location) {
      conditions.push(`(j.location ILIKE $${idx} OR j.area ILIKE $${idx})`);
      params.push(`%${location}%`);
      idx++;
    }
    if (category) {
      conditions.push(`j.category ILIKE $${idx}`);
      params.push(`%${category}%`);
      idx++;
    }
    if (job_type) {
      conditions.push(`j.job_type = $${idx}`);
      params.push(job_type);
      idx++;
    }
    if (salary_min) {
      conditions.push(`j.salary_max >= $${idx}`);
      params.push(parseInt(salary_min));
      idx++;
    }
    if (salary_max) {
      conditions.push(`j.salary_min <= $${idx}`);
      params.push(parseInt(salary_max));
      idx++;
    }

    const query = `
      SELECT j.*, COALESCE(NULLIF(ep.name, ''), 'Company Confidential') as employer_name, ep.avg_rating as employer_rating,
             ep.verification_status as employer_verified,
             ep.industry as employer_industry
      FROM jobs j
      LEFT JOIN employer_profiles ep ON j.employer_id = ep.user_id
      JOIN users u ON j.employer_id = u.id
      WHERE ${conditions.join(' AND ')}
      ORDER BY j.is_urgent DESC, j.created_at DESC
    `;
    const result = await pool.query(query, params);
    return result.rows;
  }

  static async update(jobId, employerId, data) {
    const allowedFields = ['title', 'description', 'category', 'job_type', 'location', 'salary_min', 'salary_max', 'salary', 'skills_required', 'vacancies', 'status', 'is_urgent'];
    const updates = {};
    for (const key of allowedFields) {
      if (data[key] !== undefined) updates[key] = data[key];
    }
    if (Object.keys(updates).length === 0) return this.findById(jobId);

    const fields = Object.keys(updates).map((k, i) => `${k} = $${i + 3}`).join(', ');
    const query = `UPDATE jobs SET ${fields}, updated_at = NOW() WHERE id = $1 AND employer_id = $2 RETURNING *`;
    const result = await pool.query(query, [jobId, employerId, ...Object.values(updates)]);
    return result.rows[0];
  }

  static async delete(jobId, employerId) {
    const query = 'DELETE FROM jobs WHERE id = $1 AND employer_id = $2';
    await pool.query(query, [jobId, employerId]);
  }
}

class ApplicationModel {
  static async apply(jobId, jobSeekerId, coverNote = '') {
    const query = `
      INSERT INTO job_applications (job_id, job_seeker_id, cover_note)
      VALUES ($1, $2, $3)
      ON CONFLICT (job_id, job_seeker_id) DO NOTHING
      RETURNING *;
    `;
    const result = await pool.query(query, [jobId, jobSeekerId, coverNote]);
    if (result.rows.length > 0) {
      await pool.query('UPDATE jobs SET applicants_count = applicants_count + 1 WHERE id = $1', [jobId]);
    }
    return result.rows[0];
  }

  static async getByJobSeeker(jobSeekerId) {
    const query = `
      SELECT ja.*, j.title, j.location, j.salary, j.job_type, j.status as job_status,
             COALESCE(NULLIF(ep.name, ''), 'Company Confidential') as employer_name, ep.industry as employer_industry
      FROM job_applications ja
      JOIN jobs j ON ja.job_id = j.id
      LEFT JOIN employer_profiles ep ON j.employer_id = ep.user_id
      WHERE ja.job_seeker_id = $1
      ORDER BY ja.applied_at DESC
    `;
    const result = await pool.query(query, [jobSeekerId]);
    return result.rows;
  }

  static async getByJob(jobId, employerId) {
    const query = `
      SELECT ja.*, 
             u.name as applicant_name, u.email as applicant_email,
             jsp.primary_skill, jsp.primary_skill_level, jsp.years_of_experience,
             jsp.secondary_skills, jsp.avg_rating, jsp.jobs_completed,
             jsp.phone_number, jsp.location as applicant_location,
             jsp.video_introduction_url, jsp.selfie_url
      FROM job_applications ja
      JOIN users u ON ja.job_seeker_id = u.id
      LEFT JOIN job_seeker_profiles jsp ON ja.job_seeker_id = jsp.user_id
      JOIN jobs j ON ja.job_id = j.id
      WHERE ja.job_id = $1 AND j.employer_id = $2
      ORDER BY ja.applied_at DESC
    `;
    const result = await pool.query(query, [jobId, employerId]);
    return result.rows;
  }

  static async getByEmployer(employerId) {
    const query = `
      SELECT ja.*, 
             u.name as applicant_name, u.email as applicant_email,
             jsp.primary_skill, jsp.primary_skill_level, jsp.years_of_experience,
             jsp.avg_rating, jsp.phone_number, jsp.video_introduction_url,
             j.title as job_title, j.location as job_location
      FROM job_applications ja
      JOIN users u ON ja.job_seeker_id = u.id
      LEFT JOIN job_seeker_profiles jsp ON ja.job_seeker_id = jsp.user_id
      JOIN jobs j ON ja.job_id = j.id
      WHERE j.employer_id = $1
      ORDER BY ja.applied_at DESC
    `;
    const result = await pool.query(query, [employerId]);
    return result.rows;
  }

  static async updateStatus(applicationId, jobId, employerId, status) {
    const query = `
      UPDATE job_applications ja
      SET status = $1, updated_at = NOW()
      FROM jobs j
      WHERE ja.id = $2 AND ja.job_id = $3 AND j.id = ja.job_id AND j.employer_id = $4
      RETURNING ja.*
    `;
    const result = await pool.query(query, [status, applicationId, jobId, employerId]);
    return result.rows[0];
  }

  static async withdraw(applicationId, jobSeekerId) {
    const query = `
      UPDATE job_applications SET status = 'withdrawn', updated_at = NOW()
      WHERE id = $1 AND job_seeker_id = $2 RETURNING *
    `;
    const result = await pool.query(query, [applicationId, jobSeekerId]);
    return result.rows[0];
  }
}

class SavedJobModel {
  static async save(jobSeekerId, jobId) {
    const query = `INSERT INTO saved_jobs (job_seeker_id, job_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *`;
    const result = await pool.query(query, [jobSeekerId, jobId]);
    return result.rows[0];
  }

  static async unsave(jobSeekerId, jobId) {
    const query = `DELETE FROM saved_jobs WHERE job_seeker_id = $1 AND job_id = $2`;
    await pool.query(query, [jobSeekerId, jobId]);
  }

  static async getByJobSeeker(jobSeekerId) {
    const query = `
      SELECT sj.*, j.title, j.location, j.salary, j.job_type, j.status as job_status,
          COALESCE(NULLIF(ep.name, ''), 'Company Confidential') as employer_name
      FROM saved_jobs sj
      JOIN jobs j ON sj.job_id = j.id
        LEFT JOIN employer_profiles ep ON j.employer_id = ep.user_id
      WHERE sj.job_seeker_id = $1
      ORDER BY sj.saved_at DESC
    `;
    const result = await pool.query(query, [jobSeekerId]);
    return result.rows;
  }
}

class NotificationModel {
  static async create(userId, title, message, type = 'info', relatedJobId = null) {
    const query = `
      INSERT INTO notifications (user_id, title, message, type, related_job_id)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `;
    const result = await pool.query(query, [userId, title, message, type, relatedJobId]);
    return result.rows[0];
  }

  static async getByUser(userId) {
    const query = `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async markRead(notificationId, userId) {
    const query = `UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2 RETURNING *`;
    const result = await pool.query(query, [notificationId, userId]);
    return result.rows[0];
  }

  static async markAllRead(userId) {
    await pool.query(`UPDATE notifications SET is_read = true WHERE user_id = $1`, [userId]);
  }
}

module.exports = { JobModel, ApplicationModel, SavedJobModel, NotificationModel };