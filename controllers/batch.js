// batch.controller.js

import Batch from '../models/batch.js';
import User from '../models/userModel.js';

export const getAllBatches = async (req, res) => {
    try {
        const batches = await Batch.find().populate('studentIds');
        const allStudents = await User.find(); // Retrieve all students from the User model

        const batchesWithStudents = batches.map((batch, index) => {
            if (index === 0) {
                return {
                    batch: {
                        id:batch._id,
                        name:batch.name,
                        startDate:batch.startDate,
                        studentIds:allStudents
                    },
                    studentIds: allStudents,
                    studentsInBatch: batch.studentIds.map(studentId => allStudents.find(student => student._id.toString() === studentId.toString()))
                };
            } else {
                return {
                    batch: batch,
                    studentsInBatch: batch.studentIds.map(studentId => allStudents.find(student => student._id.toString() === studentId.toString()))
                };
            }
        });

        return res.status(200).json({ batches: batchesWithStudents });
    } catch (error) {
        return res.status(500).json({ error: 'Error retrieving batches and students' });
    }
};



export const createBatch = async (req, res) => {
    try {
        const batch = await Batch.create(req.body);
        return res.status(201).json(batch);
    } catch (error) {
        return res.status(500).json({ error: 'Error creating batch' });
    }
};

export const getBatchById = async (req, res) => {
    try {
        const batch = await Batch.findById(req.params.id);
        if (!batch) {
            return res.status(404).json({ error: 'Batch not found' });
        }
        return res.status(200).json(batch);
    } catch (error) {
        return res.status(500).json({ error: 'Error retrieving batch' });
    }
};

// batch.controller.js

// Example of adding a student to a batch
export const addStudentToBatch = async (req, res) => {
    try {
        const { batchId, studentId } = req.params;
        const batch = await Batch.findById(batchId);
        if (!batch) {
            return res.status(404).json({ error: 'Batch not found' });
        }
        // Add student ID to the array
        batch.studentIds.push(studentId);
        await batch.save();
        return res.status(200).json(batch);
    } catch (error) {
        return res.status(500).json({ error: 'Error adding student to batch' });
    }
};

// Example of removing a student from a batch
export const removeStudentFromBatch = async (req, res) => {
    try {
        const { batchId, studentId } = req.params;
        const batch = await Batch.findById(batchId);
        if (!batch) {
            return res.status(404).json({ error: 'Batch not found' });
        }
        // Remove student ID from the array
        batch.studentIds.pull(studentId);
        await batch.save();
        return res.status(200).json(batch);
    } catch (error) {
        return res.status(500).json({ error: 'Error removing student from batch' });
    }
};

export const getStudentsByBatch = async (req, res) => {
    try {
        const { batchId } = req.params;
        const batch = await Batch.findById(batchId).populate('studentIds'); // Populate the studentIds field to get the complete user objects
        if (!batch) {
            return res.status(404).json({ error: 'Batch not found' });
        }
        const students = batch.studentIds;
        return res.status(200).json(students);
    } catch (error) {
        return res.status(500).json({ error: 'Error retrieving students by batch' });
    }
};

