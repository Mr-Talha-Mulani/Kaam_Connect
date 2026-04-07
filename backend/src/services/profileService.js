const { JobSeekerProfileModel, EmployerProfileModel } = require('../models/profileModel');
const UserModel = require('../models/userModel');
const ApiError = require('../utils/ApiError');

class ProfileService {
  static async getJobSeekerProfile(userId) {
    const profile = await JobSeekerProfileModel.findByUserId(userId);
    if (!profile) throw new ApiError(404, 'Profile not found');
    return profile;
  }

  static async createOrUpdateJobSeekerProfile(userId, data) {
    const existing = await JobSeekerProfileModel.findByUserId(userId);
    let profile;
    if (existing) {
      profile = await JobSeekerProfileModel.update(userId, data);
    } else {
      if (!data.phone_number) throw new ApiError(400, 'Phone number is required');
      if (!data.primary_skill) throw new ApiError(400, 'Primary skill is required');
      profile = await JobSeekerProfileModel.create(userId, data);
      await UserModel.updateProfileCompleted(userId);
    }
    return profile;
  }

  static async getEmployerProfile(userId) {
    const profile = await EmployerProfileModel.findByUserId(userId);
    if (!profile) throw new ApiError(404, 'Profile not found');
    return profile;
  }

  static async createOrUpdateEmployerProfile(userId, data) {
    const existing = await EmployerProfileModel.findByUserId(userId);
    let profile;
    if (existing) {
      profile = await EmployerProfileModel.update(userId, data);
    } else {
      // First-time profile creation may come from a short dashboard form.
      // Fill required columns with safe defaults so creation does not fail.
      const createPayload = {
        owner_name: data.owner_name || data.name || 'Business Owner',
        owner_phone: data.owner_phone || data.business_phone || '0000000000',
        name: data.name || 'My Business',
        business_address: data.business_address || data.location || 'Address not provided',
        phone_number: data.business_phone || data.owner_phone || '0000000000',
        location: data.location || data.city || 'Unknown',
        ...data,
      };
      profile = await EmployerProfileModel.upsert(userId, createPayload);
      await UserModel.updateProfileCompleted(userId);
    }
    return profile;
  }
}

module.exports = ProfileService;