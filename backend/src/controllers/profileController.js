const ProfileService = require('../services/profileService');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const AsynHandler = require('../utils/AsynHandler');

const createJobSeekerProfile = AsynHandler(async (req, res) => {
  const userId = req.user.id;
  const { skills, age, location, phone_number, qualification } = req.body;

  if (!skills || !age || !location || !phone_number || !qualification) {
    throw new ApiError(400, 'All fields are required');
  }

  // Check role
  if (req.user.role !== 'job_seeker') {
    throw new ApiError(403, 'Access denied. Only job seekers can create job seeker profiles');
  }

  const profile = await ProfileService.createJobSeekerProfile(userId, {
    skills,
    age,
    location,
    phone_number,
    qualification,
  });

  res.status(201).json(new ApiResponse(201, 'Job seeker profile created successfully', profile));
});

const createEmployerProfile = AsynHandler(async (req, res) => {
  const userId = req.user.id;
  const { name, location, business_description, phone_number } = req.body;

  if (!name || !location || !business_description || !phone_number) {
    throw new ApiError(400, 'All fields are required');
  }

  // Check role
  if (req.user.role !== 'employer') {
    throw new ApiError(403, 'Access denied. Only employers can create employer profiles');
  }

  const profile = await ProfileService.createEmployerProfile(userId, {
    name,
    location,
    business_description,
    phone_number,
  });

  res.status(201).json(new ApiResponse(201, 'Employer profile created successfully', profile));
});

module.exports = { createJobSeekerProfile, createEmployerProfile };