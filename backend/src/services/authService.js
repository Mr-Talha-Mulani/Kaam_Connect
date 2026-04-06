const UserModel = require('../models/userModel');
const { hashPassword, comparePassword } = require('../utils/hashing');
const { generateToken } = require('../utils/jwt');

class AuthService {
  static async registerUser(userData) {
    const { name, email, password, role, location } = userData;

    // Validate role
    if (!['job_seeker', 'employer'].includes(role)) {
      throw new Error('Invalid role. Must be job_seeker or employer');
    }

    // Check if email already exists
    const existingUser = await UserModel.findUserByEmail(email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await UserModel.createUser(name, email, hashedPassword, role, location);

    // Generate token
    const token = generateToken(user);

    return { user, token };
  }

  static async loginUser(email, password) {
    // Find user by email
    const user = await UserModel.findUserByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate token
    const token = generateToken(user);

    return { user, token };
  }
}

module.exports = AuthService;