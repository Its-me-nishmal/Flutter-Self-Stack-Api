import { TaskModel } from '../models/taskModel.js';
import User from '../models/userModel.js';
import httpStatus from 'http-status';

const { OK, CREATED, NOT_FOUND } = httpStatus;

const taskGet = async (req, res, next) => {
    try {
        const taskId = req.params.id;
        const task = await TaskModel.findById(taskId);
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
        const tasks = await TaskModel.find();
        res.status(OK).json(tasks);
    } catch (error) {
        next(error);
    }
};

const taskCreate = async (req, res, next) => {
    try {
        const { course_name, students, tasks } = req.body;

        const newCourse = new TaskModel({
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

        const updatedTask = await TaskModel.findByIdAndUpdate(taskId, updateFields, { new: true });
        res.status(OK).json(updatedTask);
    } catch (error) {
        next(error);
    }
};

const taskDelete = async (req, res, next) => {
    try {
        const taskId = req.params.id;

        const deletedTask = await TaskModel.findByIdAndDelete(taskId);
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
        const deletedTasks = await TaskModel.deleteMany();
        res.status(OK).json(deletedTasks);
    } catch (error) {
        next(error);
    }
};

const taskCreateMultiple = async (req, res, next) => {
    try {
        const tasks = req.body.map(task => ({ ...task }));
        const createdTasks = await TaskModel.create(tasks);
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
            const updatedTask = await TaskModel.findByIdAndUpdate(update.id, update.fieldsToUpdate, { new: true });
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
        const userTasks = await TaskModel.find({ 'students': userId });

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

        const course = await TaskModel.findById(courseId);

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
