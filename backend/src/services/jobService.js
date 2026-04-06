const JobModel = require('../models/jobModel');
const ProfileModel = require('../models/profileModel');

class JobService {
  static async createJob(employerId, jobData) {
    const { title, description, salary, skills_required, qualification_required, location, vacancies } = jobData;

    // Validate qualification_required enum
    const validQualifications = ['10th_pass', '12th_pass', 'graduate', 'post_graduate'];
    if (!validQualifications.includes(qualification_required)) {
      throw new Error('Invalid qualification_required. Must be one of: 10th_pass, 12th_pass, graduate, post_graduate');
    }

    // Validate vacancies is positive integer
    if (!Number.isInteger(vacancies) || vacancies <= 0) {
      throw new Error('Vacancies must be a positive integer');
    }

    const job = await JobModel.createJob({
      title,
      description,
      salary,
      skills_required,
      qualification_required,
      location,
      vacancies,
      employer_id: employerId,
    });

    return job;
  }

  static async getJobsByEmployer(employerId) {
    return await JobModel.getJobsByEmployer(employerId);
  }

  static async updateJob(jobId, employerId, jobData) {
    // Check if job exists and belongs to employer
    const job = await JobModel.getJobById(jobId);
    if (!job) {
      throw new Error('Job not found');
    }
    if (job.employer_id !== employerId) {
      throw new Error('Unauthorized to update this job');
    }

    const { title, description, salary, skills_required, qualification_required, location, vacancies, status } = jobData;

    // Validate qualification_required if provided
    if (qualification_required) {
      const validQualifications = ['10th_pass', '12th_pass', 'graduate', 'post_graduate'];
      if (!validQualifications.includes(qualification_required)) {
        throw new Error('Invalid qualification_required. Must be one of: 10th_pass, 12th_pass, graduate, post_graduate');
      }
    }

    // Validate status if provided
    if (status && !['open', 'closed'].includes(status)) {
      throw new Error('Invalid status. Must be open or closed');
    }

    // Validate vacancies if provided
    if (vacancies !== undefined && (!Number.isInteger(vacancies) || vacancies <= 0)) {
      throw new Error('Vacancies must be a positive integer');
    }

    const updatedJob = await JobModel.updateJob(jobId, {
      title: title || job.title,
      description: description || job.description,
      salary: salary || job.salary,
      skills_required: skills_required || job.skills_required,
      qualification_required: qualification_required || job.qualification_required,
      location: location || job.location,
      vacancies: vacancies || job.vacancies,
      status: status || job.status,
    });

    return updatedJob;
  }

  static async deleteJob(jobId, employerId) {
    // Check if job exists and belongs to employer
    const job = await JobModel.getJobById(jobId);
    if (!job) {
      throw new Error('Job not found');
    }
    if (job.employer_id !== employerId) {
      throw new Error('Unauthorized to delete this job');
    }

    await JobModel.deleteJob(jobId);
  }

  static async getJobsForJobSeeker(jobSeekerId) {
    // Get job seeker's location from profile
    const profile = await ProfileModel.findJobSeekerProfileByUserId(jobSeekerId);
    if (!profile) {
      throw new Error('Job seeker profile not found');
    }

    const jobs = await JobModel.getJobsForJobSeeker(profile.location);
    return jobs;
  }
}

module.exports = JobService;