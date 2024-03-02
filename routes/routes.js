import express from 'express';
import * as RequestCountController from '../controllers/total.js';

const router = express.Router();

router.use(RequestCountController.updateRequestCount);

router.get('/', RequestCountController.getTotalRequests);


export default router;
