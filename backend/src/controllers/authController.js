const AuthService = require('../services/authService');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const AsynHandler = require('../utils/AsynHandler');

const registerUser = AsynHandler(async (req, res) => {
  const { name, email, password, role, location } = req.body;

  if (!name || !email || !password || !role || !location) {
    throw new ApiError(400, 'All fields are required');
  }

  const result = await AuthService.registerUser({ name, email, password, role, location });

  res.status(201).json(new ApiResponse(201, 'User registered successfully', {
    user: result.user,
    token: result.token,
  }));
});

const loginUser = AsynHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const result = await AuthService.loginUser(email, password);

  res.status(200).json(new ApiResponse(200, 'Login successful', {
    user: result.user,
    token: result.token,
  }));
});

module.exports = { registerUser, loginUser };