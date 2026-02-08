import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js'
import { createCheckoutSession, getAllPurchasedCourses, getCourseDetailWithPurchaseStatus } from '../controllers/coursePurchase.controller.js';

const router=express.Router();

router.route("/checkout/create-checkout-session").post(isAuthenticated,createCheckoutSession);
// Note: /webhook route is registered directly in index.js before express.json() to receive raw body
router.route("/course/:courseId/detail-with-status").get(isAuthenticated,getCourseDetailWithPurchaseStatus);
router.route("/").get(isAuthenticated,getAllPurchasedCourses);

export default router;