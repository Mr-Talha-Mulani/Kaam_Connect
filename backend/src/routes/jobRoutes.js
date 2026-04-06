const express = require('express');
const { createJob, getEmployerJobs, updateJob, deleteJob, getJobsForJobSeeker } = require('../controllers/jobController');
const authMiddleware = require('../middlewares/auth');
const authorizeRoles = require('../middlewares/role');
const checkProfileCompletion = require('../middlewares/checkProfileCompletion');

const router = express.Router();

// All job routes require authentication and profile completion
router.use(authMiddleware);
router.use(checkProfileCompletion);

// Employer routes
router.post('/', authorizeRoles('employer'), createJob);
router.get('/my-jobs', authorizeRoles('employer'), getEmployerJobs);
router.put('/:id', authorizeRoles('employer'), updateJob);
router.delete('/:id', authorizeRoles('employer'), deleteJob);

// Job seeker routes
router.get('/', authorizeRoles('job_seeker'), getJobsForJobSeeker);

module.exports = router;