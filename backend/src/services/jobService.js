const { JobModel, ApplicationModel, SavedJobModel, NotificationModel } = require('../models/jobModel');
const ApiError = require('../utils/ApiError');

class JobService {
  // Public - no auth required
  static async searchJobs(filters) {
    return await JobModel.search(filters);
  }

  static async getJobById(jobId) {
    const job = await JobModel.findById(jobId);
    if (!job) throw new ApiError(404, 'Job not found');
    return job;
  }

  // Employer actions
  static async createJob(employerId, data) {
    if (!data.title || !data.description || !data.location || !data.job_type) {
      throw new ApiError(400, 'Title, description, location, and job_type are required');
    }
    const payload = {
      ...data,
      employer_id: employerId,
      qualification_required: data.qualification_required || 'any',
      vacancies: Number.isInteger(data.vacancies) ? data.vacancies : 1,
      is_urgent: Boolean(data.is_urgent),
    };
    return await JobModel.create(payload);
  }

  static async getMyJobs(employerId) {
    return await JobModel.findByEmployer(employerId);
  }

  static async updateJob(employerId, jobId, data) {
    const job = await JobModel.findById(jobId);
    if (!job) throw new ApiError(404, 'Job not found');
    if (job.employer_id !== employerId) throw new ApiError(403, 'Not authorized to edit this job');
    return await JobModel.update(jobId, employerId, data);
  }

  static async deleteJob(employerId, jobId) {
    const job = await JobModel.findById(jobId);
    if (!job) throw new ApiError(404, 'Job not found');
    if (job.employer_id !== employerId) throw new ApiError(403, 'Not authorized to delete this job');
    await JobModel.delete(jobId, employerId);
  }

  static async getJobApplicants(employerId, jobId) {
    return await ApplicationModel.getByJob(jobId, employerId);
  }

  static async getAllApplicants(employerId) {
    return await ApplicationModel.getByEmployer(employerId);
  }

  static async updateApplicationStatus(employerId, applicationId, jobId, status) {
    const validStatuses = ['viewed', 'shortlisted', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) throw new ApiError(400, 'Invalid status');
    const updated = await ApplicationModel.updateStatus(applicationId, jobId, employerId, status);
    if (!updated) throw new ApiError(404, 'Application not found or not authorized');

    // Create notification for job seeker
    const statusMessages = {
      viewed: 'Your application has been viewed by the employer.',
      shortlisted: 'Congratulations! You have been shortlisted.',
      accepted: 'Congratulations! Your application has been accepted.',
      rejected: 'Your application was not selected this time.',
    };
    await NotificationModel.create(
      updated.job_seeker_id,
      `Application ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      statusMessages[status],
      'application_update',
      jobId
    );
    return updated;
  }

  // Job seeker actions
  static async applyToJob(jobSeekerId, jobId, coverNote) {
    const job = await JobModel.findById(jobId);
    if (!job) throw new ApiError(404, 'Job not found');
    if (job.status !== 'open') throw new ApiError(400, 'This job is no longer accepting applications');

    const application = await ApplicationModel.apply(jobId, jobSeekerId, coverNote);
    if (!application) throw new ApiError(409, 'You have already applied to this job');

    // Notify employer
    await NotificationModel.create(
      job.employer_id,
      'New Application Received',
      `Someone has applied to your job: ${job.title}`,
      'application_update',
      jobId
    );
    return application;
  }

  static async getMyApplications(jobSeekerId) {
    return await ApplicationModel.getByJobSeeker(jobSeekerId);
  }

  static async withdrawApplication(jobSeekerId, applicationId) {
    const result = await ApplicationModel.withdraw(applicationId, jobSeekerId);
    if (!result) throw new ApiError(404, 'Application not found');
    return result;
  }

  // Saved jobs
  static async saveJob(jobSeekerId, jobId) {
    const job = await JobModel.findById(jobId);
    if (!job) throw new ApiError(404, 'Job not found');
    return await SavedJobModel.save(jobSeekerId, jobId);
  }

  static async unsaveJob(jobSeekerId, jobId) {
    await SavedJobModel.unsave(jobSeekerId, jobId);
  }

  static async getSavedJobs(jobSeekerId) {
    return await SavedJobModel.getByJobSeeker(jobSeekerId);
  }

  // Notifications
  static async getNotifications(userId) {
    return await NotificationModel.getByUser(userId);
  }

  static async markNotificationRead(userId, notificationId) {
    return await NotificationModel.markRead(notificationId, userId);
  }

  static async markAllNotificationsRead(userId) {
    await NotificationModel.markAllRead(userId);
  }
}

module.exports = JobService;