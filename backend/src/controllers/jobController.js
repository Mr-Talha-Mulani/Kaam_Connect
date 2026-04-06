const JobService = require('../services/jobService');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const AsynHandler = require('../utils/AsynHandler');

const createJob = AsynHandler(async (req, res) => {
  const employerId = req.user.id;
  const { title, description, salary, skills_required, qualification_required, location, vacancies } = req.body;

  if (!title || !description || !salary || !skills_required || !qualification_required || !location || !vacancies) {
    throw new ApiError(400, 'All fields are required');
  }

  const job = await JobService.createJob(employerId, {
    title,
    description,
    salary,
    skills_required,
    qualification_required,
    location,
    vacancies,
  });

  res.status(201).json(new ApiResponse(201, 'Job created successfully', job));
});

const getEmployerJobs = AsynHandler(async (req, res) => {
  const employerId = req.user.id;
  const jobs = await JobService.getJobsByEmployer(employerId);

  res.status(200).json(new ApiResponse(200, 'Jobs retrieved successfully', jobs));
});

const updateJob = AsynHandler(async (req, res) => {
  const employerId = req.user.id;
  const jobId = req.params.id;
  const jobData = req.body;

  const updatedJob = await JobService.updateJob(jobId, employerId, jobData);

  res.status(200).json(new ApiResponse(200, 'Job updated successfully', updatedJob));
});

const deleteJob = AsynHandler(async (req, res) => {
  const employerId = req.user.id;
  const jobId = req.params.id;

  await JobService.deleteJob(jobId, employerId);

  res.status(200).json(new ApiResponse(200, 'Job deleted successfully'));
});

const getJobsForJobSeeker = AsynHandler(async (req, res) => {
  const jobSeekerId = req.user.id;
  const jobs = await JobService.getJobsForJobSeeker(jobSeekerId);

  res.status(200).json(new ApiResponse(200, 'Jobs retrieved successfully', jobs));
});

module.exports = { createJob, getEmployerJobs, updateJob, deleteJob, getJobsForJobSeeker };