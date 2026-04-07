const express = require('express');
const {
  getJobSeekerProfile, upsertJobSeekerProfile,
  getEmployerProfile, upsertEmployerProfile,
} = require('../controllers/profileController');
const authMiddleware = require('../middlewares/auth');
const authorizeRoles = require('../middlewares/role');

const router = express.Router();
router.use(authMiddleware);

router.get('/job-seeker', authorizeRoles('job_seeker'), getJobSeekerProfile);
router.post('/job-seeker', authorizeRoles('job_seeker'), upsertJobSeekerProfile);
router.put('/job-seeker', authorizeRoles('job_seeker'), upsertJobSeekerProfile);

router.get('/employer', authorizeRoles('employer'), getEmployerProfile);
router.post('/employer', authorizeRoles('employer'), upsertEmployerProfile);
router.put('/employer', authorizeRoles('employer'), upsertEmployerProfile);

module.exports = router;