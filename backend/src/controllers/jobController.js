const JobService = require('../services/jobService');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const AsyncHandler = require('../utils/AsynHandler');

// ── Public / unauthenticated ─────────────────────────────────
const searchJobs = AsyncHandler(async (req, res) => {
  const jobs = await JobService.searchJobs(req.query);
  res.status(200).json(new ApiResponse(200, 'Jobs fetched', jobs));
});

const getJobById = AsyncHandler(async (req, res) => {
  const job = await JobService.getJobById(req.params.id);
  res.status(200).json(new ApiResponse(200, 'Job fetched', job));
});

// ── Employer ─────────────────────────────────────────────────
const createJob = AsyncHandler(async (req, res) => {
  const job = await JobService.createJob(req.user.id, req.body);
  res.status(201).json(new ApiResponse(201, 'Job created', job));
});

const getMyJobs = AsyncHandler(async (req, res) => {
  const jobs = await JobService.getMyJobs(req.user.id);
  res.status(200).json(new ApiResponse(200, 'Jobs fetched', jobs));
});

const updateJob = AsyncHandler(async (req, res) => {
  const job = await JobService.updateJob(req.user.id, req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, 'Job updated', job));
});

const deleteJob = AsyncHandler(async (req, res) => {
  await JobService.deleteJob(req.user.id, req.params.id);
  res.status(200).json(new ApiResponse(200, 'Job deleted'));
});

const getJobApplicants = AsyncHandler(async (req, res) => {
  const applicants = await JobService.getJobApplicants(req.user.id, req.params.id);
  res.status(200).json(new ApiResponse(200, 'Applicants fetched', applicants));
});

const getAllApplicants = AsyncHandler(async (req, res) => {
  const applicants = await JobService.getAllApplicants(req.user.id);
  res.status(200).json(new ApiResponse(200, 'Applicants fetched', applicants));
});

const updateApplicationStatus = AsyncHandler(async (req, res) => {
  const { status } = req.body;
  const { jobId, applicationId } = req.params;
  const updated = await JobService.updateApplicationStatus(req.user.id, applicationId, jobId, status);
  res.status(200).json(new ApiResponse(200, 'Application status updated', updated));
});

// ── Job Seeker ────────────────────────────────────────────────
const applyToJob = AsyncHandler(async (req, res) => {
  const { cover_note } = req.body;
  const application = await JobService.applyToJob(req.user.id, req.params.id, cover_note);
  res.status(201).json(new ApiResponse(201, 'Applied successfully', application));
});

const getMyApplications = AsyncHandler(async (req, res) => {
  const applications = await JobService.getMyApplications(req.user.id);
  res.status(200).json(new ApiResponse(200, 'Applications fetched', applications));
});

const withdrawApplication = AsyncHandler(async (req, res) => {
  await JobService.withdrawApplication(req.user.id, req.params.applicationId);
  res.status(200).json(new ApiResponse(200, 'Application withdrawn'));
});

const saveJob = AsyncHandler(async (req, res) => {
  const result = await JobService.saveJob(req.user.id, req.params.id);
  res.status(200).json(new ApiResponse(200, 'Job saved', result));
});

const unsaveJob = AsyncHandler(async (req, res) => {
  await JobService.unsaveJob(req.user.id, req.params.id);
  res.status(200).json(new ApiResponse(200, 'Job removed from saved'));
});

const getSavedJobs = AsyncHandler(async (req, res) => {
  const jobs = await JobService.getSavedJobs(req.user.id);
  res.status(200).json(new ApiResponse(200, 'Saved jobs fetched', jobs));
});

// ── Notifications ─────────────────────────────────────────────
const getNotifications = AsyncHandler(async (req, res) => {
  const notifications = await JobService.getNotifications(req.user.id);
  res.status(200).json(new ApiResponse(200, 'Notifications fetched', notifications));
});

const markNotificationRead = AsyncHandler(async (req, res) => {
  const n = await JobService.markNotificationRead(req.user.id, req.params.id);
  res.status(200).json(new ApiResponse(200, 'Marked read', n));
});

const markAllRead = AsyncHandler(async (req, res) => {
  await JobService.markAllNotificationsRead(req.user.id);
  res.status(200).json(new ApiResponse(200, 'All notifications marked read'));
});

module.exports = {
  searchJobs, getJobById,
  createJob, getMyJobs, updateJob, deleteJob, getJobApplicants, getAllApplicants, updateApplicationStatus,
  applyToJob, getMyApplications, withdrawApplication, saveJob, unsaveJob, getSavedJobs,
  getNotifications, markNotificationRead, markAllRead,
};