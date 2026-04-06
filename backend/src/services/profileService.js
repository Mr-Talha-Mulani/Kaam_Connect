const ProfileModel = require('../models/profileModel');
const UserModel = require('../models/userModel');

class ProfileService {
  static async createJobSeekerProfile(userId, profileData) {
    const { skills, age, location, phone_number, qualification } = profileData;

    // Validate qualification enum
    const validQualifications = ['10th_pass', '12th_pass', 'graduate', 'post_graduate'];
    if (!validQualifications.includes(qualification)) {
      throw new Error('Invalid qualification. Must be one of: 10th_pass, 12th_pass, graduate, post_graduate');
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(phone_number)) {
      throw new Error('Invalid phone number format');
    }

    // Check if profile already exists
    const existingProfile = await ProfileModel.findJobSeekerProfileByUserId(userId);
    if (existingProfile) {
      throw new Error('Profile already exists for this user');
    }

    // Create profile
    const profile = await ProfileModel.createJobSeekerProfile(userId, skills, age, location, phone_number, qualification);

    // Update user profile completed status
    await UserModel.updateProfileCompleted(userId);

    return profile;
  }

  static async createEmployerProfile(userId, profileData) {
    const { name, location, business_description, phone_number } = profileData;

    // Validate phone number format (basic validation)
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(phone_number)) {
      throw new Error('Invalid phone number format');
    }

    // Check if profile already exists
    const existingProfile = await ProfileModel.findEmployerProfileByUserId(userId);
    if (existingProfile) {
      throw new Error('Profile already exists for this user');
    }

    // Create profile
    const profile = await ProfileModel.createEmployerProfile(userId, name, location, business_description, phone_number);

    // Update user profile completed status
    await UserModel.updateProfileCompleted(userId);

    return profile;
  }
}

module.exports = ProfileService;