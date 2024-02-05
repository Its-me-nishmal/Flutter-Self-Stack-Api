import { CourseModel } from '../models/taskModel.js';
import User from '../models/userModel.js';
import httpStatus from 'http-status';

const { OK, CREATED, NOT_FOUND } = httpStatus;

const courseGet = async (req, res, next) => {
    try {
        const courseId = req.params.id;
        const course = await CourseModel.findById(courseId);
        if (!course) {
            return res.status(NOT_FOUND).json({ error: 'Course not found' });
        }
        res.status(OK).json(course);
    } catch (error) {
        next(error);
    }
};

const courseGetAll = async (req, res, next) => {
    try {
        const courses = await CourseModel.find();
        res.status(OK).json(courses);
    } catch (error) {
        next(error);
    }
};

const courseCreate = async (req, res, next) => {
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

const courseUpdate = async (req, res, next) => {
    try {
        const courseId = req.params.id;
        const updateFields = req.body;

        const updatedCourse = await CourseModel.findByIdAndUpdate(courseId, updateFields, { new: true });
        res.status(OK).json(updatedCourse);
    } catch (error) {
        next(error);
    }
};

const courseDelete = async (req, res, next) => {
    try {
        const courseId = req.params.id;

        const deletedCourse = await CourseModel.findByIdAndDelete(courseId);
        if (!deletedCourse) {
            return res.status(NOT_FOUND).json({ error: 'Course not found' });
        }
        res.status(OK).json(deletedCourse);
    } catch (error) {
        next(error);
    }
};

const courseDelAll = async (req, res, next) => {
    try {
        const deletedCourses = await CourseModel.deleteMany();
        res.status(OK).json(deletedCourses);
    } catch (error) {
        next(error);
    }
};

const courseCreateMultiple = async (req, res, next) => {
    try {
        const courses = req.body.map(course => ({ ...course }));
        const createdCourses = await CourseModel.create(courses);
        res.status(OK).json(createdCourses);
    } catch (error) {
        next(error);
    }
};

const courseUpdateMultiple = async (req, res, next) => {
    try {
        const updates = req.body;
        const updatedCourses = [];

        for (const update of updates) {
            const updatedCourse = await CourseModel.findByIdAndUpdate(update.id, update.fieldsToUpdate, { new: true });
            updatedCourses.push(updatedCourse);
        }

        res.status(OK).json(updatedCourses);
    } catch (error) {
        next(error);
    }
};

const getUserCourses = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        const userCourses = await CourseModel.find({ 'students': userId });

        if (!userCourses || userCourses.length === 0) {
            return res.status(NOT_FOUND).json({ error: 'User courses not found' });
        }

        const userData = await User.findOne({ '_id': userId });

        if (!userData) {
            return res.status(NOT_FOUND).json({ error: 'User data not found' });
        }

        const response = {
            userCourses: userCourses,
            userData: userData
        };

        res.status(OK).json(response);
    } catch (err) {
        next(err);
    }
};

const innerCourseGet = async (req, res, next) => {
    try {
        const courseId = req.params.courseId;
        const innerCourseId = req.params.innerCourseId;

        const course = await CourseModel.findById(courseId);

        if (!course) {
            return res.status(NOT_FOUND).json({ error: 'Course not found' });
        }

        const innerCourse = course.tasks.id(innerCourseId);

        if (!innerCourse) {
            return res.status(NOT_FOUND).json({ error: 'Inner Course not found' });
        }

        res.status(OK).json(innerCourse);
    } catch (error) {
        next(error);
    }
};

export default {
    courseGet,
    courseGetAll,
    courseCreate,
    courseUpdate,
    courseDelete,
    courseDelAll,
    courseCreateMultiple,
    courseUpdateMultiple,
    getUserCourses,
    innerCourseGet
};
