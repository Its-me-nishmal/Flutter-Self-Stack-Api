import express from 'express';
import { getfeedback, postFeedback } from '../controllers/feedback.js';

const router = express.Router();

router.post('/', postFeedback);
router.get('/', getfeedback)


export default router;
