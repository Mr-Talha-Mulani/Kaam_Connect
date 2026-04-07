const ProfileService = require('../services/profileService');
const ApiResponse = require('../utils/ApiResponse');
const AsyncHandler = require('../utils/AsynHandler');

// Job Seeker
const getJobSeekerProfile = AsyncHandler(async (req, res) => {
  const profile = await ProfileService.getJobSeekerProfile(req.user.id);
  res.status(200).json(new ApiResponse(200, 'Profile fetched', profile));
});

const upsertJobSeekerProfile = AsyncHandler(async (req, res) => {
  const profile = await ProfileService.createOrUpdateJobSeekerProfile(req.user.id, req.body);
  res.status(200).json(new ApiResponse(200, 'Profile saved', profile));
});

// Employer
const getEmployerProfile = AsyncHandler(async (req, res) => {
  const profile = await ProfileService.getEmployerProfile(req.user.id);
  res.status(200).json(new ApiResponse(200, 'Profile fetched', profile));
});

const upsertEmployerProfile = AsyncHandler(async (req, res) => {
  const profile = await ProfileService.createOrUpdateEmployerProfile(req.user.id, req.body);
  res.status(200).json(new ApiResponse(200, 'Profile saved', profile));
});

module.exports = { getJobSeekerProfile, upsertJobSeekerProfile, getEmployerProfile, upsertEmployerProfile };