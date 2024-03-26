// attendanceRoutes.js
import express from 'express';
import { addAttendance,getAllBatchesWithTodayAttendance, addMultipleAttendance, updateAttendance, getAttendanceByStudentId,updateMultipleAttendance  } from '../controllers/attendences.js';

const router = express.Router();

router.post('/attendance', addAttendance);
router.put('/attendance/:attendanceId', updateAttendance);
router.get('/attendance/:studentId', getAttendanceByStudentId);
router.get('/attendance/:studentId', getAttendanceByStudentId);
router.post('/attendance/multiple', addMultipleAttendance);
router.put('/attendance/multiple', updateMultipleAttendance); 
router.get('/batchwise', getAllBatchesWithTodayAttendance)

export default router;
