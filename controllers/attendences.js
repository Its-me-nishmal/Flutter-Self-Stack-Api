// attendanceController.js

import Attendance from '../models/attendences.js';
import Batch from '../models/batch.js'
import User from '../models/userModel.js';

export const addAttendance = async (req, res) => {
    try {
        const { advisorId, studentId, date, status } = req.body;
        const dateOnly = new Date(date).toISOString().split('T')[0];
        const existingAttendance = await Attendance.findOne({ studentId, date: { $gte: dateOnly, $lt: new Date(dateOnly).setDate(new Date(dateOnly).getDate() + 1) } });
        
        
        
        if (existingAttendance) {
            // If attendance already exists, update the status
            existingAttendance.status = status;
            await existingAttendance.save();
            res.status(201).json({ message: 'Attendance updated successfully' });
        } else {
            // If attendance doesn't exist, create a new attendance record
            const attendance = new Attendance({
                advisorId,
                studentId,
                date,
                status
            });
            await attendance.save();
            res.status(201).json({ message: 'Attendance added successfully' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add/update attendance' });
    }
};


export const updateAttendance = async (req, res) => {
    try {
        // Logic to update attendance
        const { attendanceId } = req.params;
        const { status } = req.body;
        await Attendance.findByIdAndUpdate(attendanceId, { status });
        res.status(200).json({ message: 'Attendance updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update attendance' });
    }
};

export const getAttendanceByStudentId = async (req, res) => {
    try {
        // Logic to get attendance records by student ID
        const { studentId } = req.params;
        const attendanceRecords = await Attendance.find({ studentId });
        res.status(200).json(attendanceRecords);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch attendance records' });
    }
};

export const addMultipleAttendance = async (req, res) => {
    try {
        const { attendanceRecords } = req.body;

        // Insert multiple attendance records
        await Attendance.insertMany(attendanceRecords);

        res.status(201).json({ message: 'Attendance added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add attendance' });
    }
};

export const updateMultipleAttendance = async (req, res) => {
    try {
        const { attendanceUpdates } = req.body;

        // Update multiple attendance records
        await Promise.all(attendanceUpdates.map(async (update) => {
            const { attendanceId, status } = update;
            await Attendance.findByIdAndUpdate(attendanceId, { status });
        }));

        res.status(200).json({ message: 'Attendance updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update attendance' });
    }
};


export const getAllBatchesWithTodayAttendance = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to the beginning of the day
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1); // Get tomorrow's date

        const batches = await Batch.find().populate('studentIds');
        const allStudents = await User.find().sort({ updatedAt: -1, createdAt: -1 }).exec();

        const batchesWithAttendance = await Promise.all(batches.map(async (batch, index) => {
            const batchObj = {
                id: batch._id,
                name: batch.name,
                startDate: batch.startDate,
                students: []
            };

            if (index === 0) {
                // For the first batch, include all students
                const studentAttendancePromises = allStudents.map(async (student) => {
                    const attendanceRecord = await Attendance.findOne({
                        studentId: student._id,
                        date: { $gte: today, $lt: tomorrow }
                    });
                    return {
                        id: student._id,
                        name: student.name,
                        attendance: attendanceRecord // Set attendance to null for all students in the first batch
                    };
                });
                batchObj.students = await Promise.all(studentAttendancePromises);
            } else {
                // For other batches, include attendance records for each student
                for (const student of batch.studentIds) {
                    const attendanceRecord = await Attendance.findOne({
                        studentId: student._id,
                        date: { $gte: today, $lt: tomorrow }
                    });
                    if (attendanceRecord) {
                        const studentObj = {
                            id: student._id,
                            name: student.name,
                            attendance: attendanceRecord
                        };
                        batchObj.students.push(studentObj);
                    } else {
                        const studentObj = {
                            id: student._id,
                            name: student.name,
                            attendance: {
                                status:"offline"
                            }
                        };
                        batchObj.students.push(studentObj);
                    }
                }
            }

            return batchObj;
        }));

        return res.status(200).json({ batches: batchesWithAttendance });
    } catch (error) {
        return res.status(500).json({ error: 'Error retrieving batches and today\'s attendance records' });
    }
};