import { createAboutUs, getAboutUs, updateAboutUs } from '../controllers/aboutus.js';
import express from 'express';
const router = express.Router();

router.get('/', getAboutUs)
router.put('/', updateAboutUs)
router.post('/', createAboutUs)


export default router;
