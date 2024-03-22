import { CourseModel } from '../models/taskModel.js';
import User from '../models/userModel.js';
import httpStatus from 'http-status';

const { OK, CREATED, NOT_FOUND } = httpStatus;

const taskGet = async (req, res, next) => {
    try {
        const taskId = req.params.id;
        const task = await CourseModel.findById(taskId);
        if (!task) {
            return res.status(NOT_FOUND).json({ error: 'Task not found' });
        }
        res.status(OK).json(task);
    } catch (error) {
        next(error);
    }
};


const taskGetAll = async (req, res, next) => {
    try {
        const tasks = await CourseModel.find();
        const tasksWithStudents = await Promise.all(tasks.map(async (task) => {
            const studentsDetails = await Promise.all(task.students.map(async (studentId) => {
                // Assuming you have a StudentModel for fetching student details
                const student = await StudentModel.findById(studentId);
                return student;
            }));
            return { ...task.toObject(), students: studentsDetails };
        }));
        res.status(200).json(tasksWithStudents);
    } catch (error) {
        next(error);
    }
};

const taskCreate = async (req, res, next) => {
    try {
        const { course_name, students, tasks } = req.body;

        const newCourse = new CourseModel({
            course_name,
            students,
            tasks,
        });

        const savedCourse = await newCourse.save();
        res.status(CREATED).json(savedCourse);
    } catch (error) {
        next(error);
    }
};


const taskUpdate = async (req, res, next) => {
    try {
        const taskId = req.params.id;
        const updateFields = req.body;

        const updatedTask = await CourseModel.findByIdAndUpdate(taskId, updateFields, { new: true });
        res.status(OK).json(updatedTask);
    } catch (error) {
        next(error);
    }
};

const taskDelete = async (req, res, next) => {
    try {
        const taskId = req.params.id;

        const deletedTask = await CourseModel.findByIdAndDelete(taskId);
        if (!deletedTask) {
            return res.status(NOT_FOUND).json({ error: 'Task not found' });
        }
        res.status(OK).json(deletedTask);
    } catch (error) {
        next(error);
    }
};

const taskDelAll = async (req, res, next) => {
    try {
        const deletedTasks = await CourseModel.deleteMany();
        res.status(OK).json(deletedTasks);
    } catch (error) {
        next(error);
    }
};

const taskCreateMultiple = async (req, res, next) => {
    try {
        const tasks = req.body.map(task => ({ ...task }));
        const createdTasks = await CourseModel.create(tasks);
        res.status(OK).json(createdTasks);
    } catch (error) {
        next(error);
    }
};

const taskUpdateMultiple = async (req, res, next) => {
    try {
        const updates = req.body;
        const updatedTasks = [];

        for (const update of updates) {
            const updatedTask = await CourseModel.findByIdAndUpdate(update.id, update.fieldsToUpdate, { new: true });
            updatedTasks.push(updatedTask);
        }

        res.status(OK).json(updatedTasks);
    } catch (error) {
        next(error);
    }
};

const getUserTasks = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        // Assuming you have a user model with the ID stored in the 'students' array
        const userTasks = await CourseModel.find({ 'students': userId });

        if (!userTasks || userTasks.length === 0) {
            return res.status(NOT_FOUND).json({ error: 'User tasks not found' });
        }

        // Fetch user data separately
        const userData = await User.findOne({ '_id': userId });

        if (!userData) {
            return res.status(NOT_FOUND).json({ error: 'User data not found' });
        }

        // Combine user tasks and user data in a single response
        const response = {
            userTasks: userTasks,
            userData: userData
        };

        res.status(OK).json(response);
    } catch (err) {
        // Pass any errors to the error-handling middleware
        next(err);
    }
};


const innerTaskGet = async (req, res, next) => {
    try {
        const courseId = req.params.courseId;
        const taskId = req.params.taskId;

        const course = await CourseModel.findById(courseId);

        if (!course) {
            return res.status(NOT_FOUND).json({ error: 'Course not found' });
        }

        const task = course.tasks.id(taskId);

        if (!task) {
            return res.status(NOT_FOUND).json({ error: 'Task not found' });
        }

        res.status(OK).json(task);
    } catch (error) {
        next(error);
    }
};


export default {
    taskGet,
    taskGetAll,
    taskCreate,
    taskUpdate,
    taskDelete,
    taskDelAll,
    taskCreateMultiple,
    taskUpdateMultiple,
    getUserTasks,
    innerTaskGet
};
