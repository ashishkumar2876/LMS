import express from 'express';
const router=express.Router();
import isAuthenticated from '../middlewares/isAuthenticated.js'
import { getCourseProgress, markAsCompleted, markAsInCompleted, updateLectureProgress } from '../controllers/courseProgress.controller.js';

router.route("/:courseId").get(isAuthenticated,getCourseProgress);
router.route("/:courseId/lecture/:lectureId/view").post(isAuthenticated,updateLectureProgress);
router.route("/:courseId/complete").post(isAuthenticated,markAsCompleted);
router.route("/:courseId/incomplete").post(isAuthenticated,markAsInCompleted);

export default router;