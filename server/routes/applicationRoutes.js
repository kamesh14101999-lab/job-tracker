import express from 'express';
import {
  getApplications,
  getStats,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
} from '../controllers/applicationController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Must come before "/:id" so "stats" isn't captured as an id
router.get('/stats', getStats);

router.route('/')
  .get(getApplications)
  .post(createApplication);

router.route('/:id')
  .get(getApplication)
  .patch(updateApplication)
  .delete(deleteApplication);

export default router;
