import express from 'express';
import taskController from '../controllers/task.js';

const router = express.Router();

router.get('/:id', taskController.taskGet);
router.get('/', taskController.taskGetAll);
router.delete('/:id', taskController.taskDel);
router.delete('/', taskController.taskDelAll);
router.post('/', taskController.taskCreate);
router.put('/:id', taskController.taskUpdate);
router.post('/multiple', taskController.taskCreateMultiple);
router.put('/multiple', taskController.taskUpdateMultiple);

export default router;
