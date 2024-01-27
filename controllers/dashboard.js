import { TaskModel } from '../models/taskModel.js';
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

export default {
    taskGet,
    taskGetAll,
    taskCreate,
    taskUpdate,
    taskDelete,
    taskDelAll,
    taskCreateMultiple,
    taskUpdateMultiple,
};
