const express = require('express');
const {
  searchJobs, getJobById,
  createJob, getMyJobs, updateJob, deleteJob, getJobApplicants, getAllApplicants, updateApplicationStatus,
  applyToJob, getMyApplications, withdrawApplication, saveJob, unsaveJob, getSavedJobs,
  getNotifications, markNotificationRead, markAllRead,
} = require('../controllers/jobController');
const authMiddleware = require('../middlewares/auth');
const authorizeRoles = require('../middlewares/role');

const router = express.Router();

// ── Public (no auth needed) ──────────────────────────────────
router.get('/', searchJobs);
router.get('/:id', getJobById);

// ── Authenticated routes ─────────────────────────────────────
router.use(authMiddleware);

// Employer routes
router.post('/', authorizeRoles('employer'), createJob);
router.get('/employer/my-jobs', authorizeRoles('employer'), getMyJobs);
router.put('/:id', authorizeRoles('employer'), updateJob);
router.delete('/:id', authorizeRoles('employer'), deleteJob);
router.get('/:id/applicants', authorizeRoles('employer'), getJobApplicants);
router.get('/employer/all-applicants', authorizeRoles('employer'), getAllApplicants);
router.patch('/:jobId/applicants/:applicationId/status', authorizeRoles('employer'), updateApplicationStatus);

// Job seeker routes
router.post('/:id/apply', authorizeRoles('job_seeker'), applyToJob);
router.get('/seeker/my-applications', authorizeRoles('job_seeker'), getMyApplications);
router.patch('/seeker/applications/:applicationId/withdraw', authorizeRoles('job_seeker'), withdrawApplication);
router.post('/:id/save', authorizeRoles('job_seeker'), saveJob);
router.delete('/:id/save', authorizeRoles('job_seeker'), unsaveJob);
router.get('/seeker/saved', authorizeRoles('job_seeker'), getSavedJobs);

// Notifications (both roles)
router.get('/notifications/all', getNotifications);
router.patch('/notifications/:id/read', markNotificationRead);
router.patch('/notifications/read-all', markAllRead);

module.exports = router;