import express from 'express';
import taskController from '../controllers/dashboard.js';

const router = express.Router();

router.get('/:id', taskController.taskGet);
router.get('/', taskController.taskGetAll);
router.delete('/:id', taskController.taskDelete);
router.delete('/', taskController.taskDelAll);
router.post('/', taskController.taskCreate);
router.put('/:id', taskController.taskUpdate);
router.post('/multiple', taskController.taskCreateMultiple);
router.put('/multiple', taskController.taskUpdateMultiple);

export default router;