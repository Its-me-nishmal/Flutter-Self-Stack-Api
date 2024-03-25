// batch.routes.js
import express from 'express';
import {getAllBatches,deleteBatch, createBatch, getBatchById, addStudentToBatch, removeStudentFromBatch, getStudentsByBatch } from '../controllers/batch.js';

const router = express.Router();

router.post('/', createBatch);
router.get('/', getAllBatches); 
router.get('/:id', getBatchById);
router.get('/:batchId/students', getStudentsByBatch);
router.post('/:batchId/students/:studentId', addStudentToBatch); // Route for adding a student to a batch
router.delete('/:batchId/students/:studentId', removeStudentFromBatch);
router.delete('/batches/:id', deleteBatch);
// Add routes for other CRUD operations

export default router;
