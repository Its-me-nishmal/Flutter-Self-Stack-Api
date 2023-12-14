// errorMiddleware.js
import httpStatus from 'http-status';

const { OK, INTERNAL_SERVER_ERROR } = httpStatus;


export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
};
