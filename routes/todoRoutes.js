// routes/todoRoutes.js
import express from 'express';
import * as todoController from '../controllers/todoController.js';

const router = express.Router();

router.post('/', todoController.createTodo);
router.put('/:id', todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);
router.get('/:id', todoController.getTodoById);

export default router;
