import express from 'express';
import { updateProgress, getAllProgress, deleteProgress } from '../controllers/progressController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All progress routes are protected
router.use(protect);

router.get('/', getAllProgress);
router.post('/update', updateProgress);
router.delete('/:algorithmId', deleteProgress);

export default router;
