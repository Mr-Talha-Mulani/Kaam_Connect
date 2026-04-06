const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (user) => {
  const payload = {
    id: user.id,
    role: user.role,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
};

module.exports = { generateToken };