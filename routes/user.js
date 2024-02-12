import express from 'express';
import userController from '../controllers/user.js';
import { getReviewsByStudent, saveReview, getReviewByIdAndStudent } from '../controllers/review.js';

// import auth from '../middleware/auth.js'

const router = express.Router();

router.get('/:id', userController.userGet);
router.get('/', userController.userGetAll);
router.delete('/:id', userController.userDel);
router.delete('/', userController.userDelAll);
router.post('/', userController.userCreate);
router.put('/:id', userController.userUpdate);
router.post('/multiple', userController.userCreateMultiple);
router.put('/multiple', userController.userUpdateMultiple);
router.post('/signin',userController.signIn);
router.post('/forgot-password', userController.forgotPassword);
router.post('/updatePassword', userController.updatePassword);
router.post('/verifyOTP',userController.verifyOTP);
router.post('/loginGoogle',userController.loginWithGoogle)
router.get('/:studentId/reviews',getReviewsByStudent)


router.post('/reviews', saveReview);
router.put('/reviews/:reviewId', saveReview);
router.get('/:studentId/reviews/:reviewId', getReviewByIdAndStudent);

export default router;
