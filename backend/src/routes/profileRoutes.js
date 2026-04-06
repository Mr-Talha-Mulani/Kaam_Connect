const express = require('express');
const { createJobSeekerProfile, createEmployerProfile } = require('../controllers/profileController');
const authMiddleware = require('../middlewares/auth');
const authorizeRoles = require('../middlewares/role');

const router = express.Router();

// All profile routes require authentication
router.use(authMiddleware);

router.post('/job-seeker', authorizeRoles('job_seeker'), createJobSeekerProfile);
router.post('/employer', authorizeRoles('employer'), createEmployerProfile);

module.exports = router;