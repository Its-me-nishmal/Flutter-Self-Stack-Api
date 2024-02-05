import express from 'express';
import { postFeedback } from '../controllers/feedback.js';
// import auth from '../middleware/auth.js'

const router = express.Router();

router.post('/feedback', postFeedback);



export default router;
