// attendanceRoutes.js
import express from 'express';
import { addAttendance, addMultipleAttendance, updateAttendance, getAttendanceByStudentId,updateMultipleAttendance  } from '../controllers/attendanceController';

const router = express.Router();

router.post('/attendance', addAttendance);
router.put('/attendance/:attendanceId', updateAttendance);
router.get('/attendance/:studentId', getAttendanceByStudentId);
router.get('/attendance/:studentId', getAttendanceByStudentId);
router.post('/attendance/multiple', addMultipleAttendance);
router.put('/attendance/multiple', updateMultipleAttendance); 

export default router;
