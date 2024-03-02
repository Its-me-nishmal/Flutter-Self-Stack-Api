import { createAboutUs, getAboutUs, updateAboutUs } from '../controllers/aboutus.js';
import express from 'express';
const router = express.Router();

router.get('/about', getAboutUs)
router.put('/about', updateAboutUs)
router.post('/about', createAboutUs)


export default router;
