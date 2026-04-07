const UserModel = require('../models/userModel');
const { hashPassword, comparePassword } = require('../utils/hashing');
const { generateToken } = require('../utils/jwt');
const ApiError = require('../utils/ApiError');

class AuthService {
  static async registerUser(userData) {
    const { name, email, password, role, location, phone } = userData;

    if (!['job_seeker', 'employer'].includes(role)) {
      throw new ApiError(400, 'Invalid role. Must be job_seeker or employer');
    }

    const existingUser = await UserModel.findUserByEmail(email);
    if (existingUser) {
      throw new ApiError(400, 'An account with this email already exists');
    }

    const hashedPassword = await hashPassword(password);
    const user = await UserModel.createUser(name, email, hashedPassword, role, location, phone);
    const token = generateToken(user);

    return { user, token };
  }

  static async loginUser(email, password) {
    const user = await UserModel.findUserByEmail(email);
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const token = generateToken(user);
    const { password: _, ...safeUser } = user;
    return { user: safeUser, token };
  }

  static async getMe(userId) {
    const user = await UserModel.findUserById(userId);
    if (!user) throw new ApiError(404, 'User not found');
    const { password: _, ...safeUser } = user;
    return safeUser;
  }
}

module.exports = AuthService;