// attendanceController.js

import Attendance from '../models/attendences.js';

export const addAttendance = async (req, res) => {
    try {
        const { advisorId, studentId, date, status } = req.body;
        
        // Check if attendance already exists for the student on the given date
        const existingAttendance = await Attendance.findOne({ studentId, date });
        
        if (existingAttendance) {
            // If attendance already exists, update the status
            existingAttendance.status = status;
            await existingAttendance.save();
            res.status(200).json({ message: 'Attendance updated successfully' });
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