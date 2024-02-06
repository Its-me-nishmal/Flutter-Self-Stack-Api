import express from 'express';
import { postFeedback } from '../controllers/feedback.js';

const router = express.Router();

router.post('/', postFeedback);



export default router;
