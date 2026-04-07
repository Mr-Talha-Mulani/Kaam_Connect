const AuthService = require('../services/authService');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const AsyncHandler = require('../utils/AsynHandler');

const registerUser = AsyncHandler(async (req, res) => {
  const { name, email, password, role, location, phone } = req.body;
  if (!name || !email || !password || !role) {
    throw new ApiError(400, 'Name, email, password, and role are required');
  }
  const result = await AuthService.registerUser({ name, email, password, role, location, phone });
  res.status(201).json(new ApiResponse(201, 'User registered successfully', result));
});

const loginUser = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, 'Email and password are required');
  const result = await AuthService.loginUser(email, password);
  res.status(200).json(new ApiResponse(200, 'Login successful', result));
});

const getMe = AsyncHandler(async (req, res) => {
  const user = await AuthService.getMe(req.user.id);
  res.status(200).json(new ApiResponse(200, 'User fetched', user));
});

module.exports = { registerUser, loginUser, getMe };