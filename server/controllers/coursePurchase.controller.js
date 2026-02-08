import Stripe from "stripe";
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { User } from "../models/user.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found!" });

    // Create a new course purchase record
    const newPurchase = new CoursePurchase({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "pending",
    });

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: course.courseTitle,
              images: [course.courseThumbnail],
            },
            unit_amount: course.coursePrice * 100, // Amount in paise (lowest denomination)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `https://lms-1-sh7o.onrender.com/course-progress/${courseId}`, // once payment successful redirect to course progress page
      cancel_url: `https://lms-1-sh7o.onrender.com/course-detail/${courseId}`,
      metadata: {
        courseId: courseId,
        userId: userId,
      },
      shipping_address_collection: {
        allowed_countries: ["IN"], // Optionally restrict allowed countries
      },
    });

    if (!session.url) {
      return res
        .status(400)
        .json({ success: false, message: "Error while creating session" });
    }

    // Save the purchase record
    newPurchase.paymentId = session.id;
    await newPurchase.save();

    return res.status(200).json({
      success: true,
      url: session.url, // Return the Stripe checkout URL
    });
  } catch (error) {
    console.log(error);
  }
};

export const stripeWebhook = async (req, res) => {
  console.log("=== WEBHOOK RECEIVED ===");
  console.log("Headers:", JSON.stringify(req.headers, null, 2));
  console.log("Body type:", typeof req.body);
  console.log("Body length:", req.body?.length || 0);
  
  let event;

  try {
    const payloadString = JSON.stringify(req.body, null, 2);
    const secret = process.env.WEBHOOK_ENDPOINT_SECRET;

    if (!secret) {
      console.error("ERROR: WEBHOOK_ENDPOINT_SECRET is not set in environment variables!");
      return res.status(500).send("Webhook secret not configured");
    }

    console.log("Webhook secret exists:", secret ? "Yes" : "No");

    // Get the signature from header (for production) or generate test header (for development)
    const sig = req.headers['stripe-signature'];
    console.log("Stripe signature header:", sig ? "Present" : "Missing");
    let header = sig;

    // If no signature in header (local development with Stripe CLI), use test header
    if (!header) {
      console.log("No signature header, generating test header for local development");
      header = stripe.webhooks.generateTestHeaderString({
        payload: payloadString,
        secret,
      });
    }

    event = stripe.webhooks.constructEvent(payloadString, header, secret);
    console.log("Webhook event verified successfully. Event type:", event.type);
  } catch (error) {
    console.error("=== WEBHOOK VERIFICATION ERROR ===");
    console.error("Error message:", error.message);
    console.error("Error details:", error);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  // Handle the checkout session completed event
  if (event.type === "checkout.session.completed") {
    console.log("check session complete is called");

    try {
      const session = event.data.object;

      const purchase = await CoursePurchase.findOne({
        paymentId: session.id,
      }).populate({ path: "courseId" });

      if (!purchase) {
        return res.status(404).json({ message: "Purchase not found" });
      }

      if (session.amount_total) {
        purchase.amount = session.amount_total / 100;
      }
      purchase.status = "completed";

      // Note: Purchase status is tracked in CoursePurchase.status = "completed"
      // Access control should be checked when displaying lectures by verifying:
      // 1. CoursePurchase.findOne({ userId, courseId, status: "completed" })
      // 2. User.enrolledCourses array
      // 3. Course.enrolledStudents array
      // Do NOT modify isPreviewFree flag - it should remain a course-level setting

      await purchase.save();

      // Update user's enrolledCourses
      await User.findByIdAndUpdate(
        purchase.userId,
        { $addToSet: { enrolledCourses: purchase.courseId._id } }, // Add course ID to enrolledCourses
        { new: true }
      );

      // Update course to add user ID to enrolledStudents
      await Course.findByIdAndUpdate(
        purchase.courseId._id,
        { $addToSet: { enrolledStudents: purchase.userId } }, // Add user ID to enrolledStudents
        { new: true }
      );
    } catch (error) {
      console.error("Error handling event:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  res.status(200).send();
};
export const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const course = await Course.findById(courseId)
      .populate({ path: "creator" })
      .populate({ path: "lectures" });

    const purchased = await CoursePurchase.findOne({ userId, courseId,status:'completed' });

    if (!course) {
      return res.status(404).json({ message: "course not found!" });
    }

    // Filter lectures based on purchase status
    let filteredLectures = course.lectures;
    if (!purchased) {
      // If not purchased, only show preview lectures (isPreviewFree: true)
      filteredLectures = course.lectures.filter(lecture => lecture.isPreviewFree === true);
    }
    // If purchased, show all lectures (no filtering needed)

    // Create course object with filtered lectures
    const courseWithFilteredLectures = {
      ...course.toObject(),
      lectures: filteredLectures
    };

    return res.status(200).json({
      course: courseWithFilteredLectures,
      purchased: purchased?true:false, // true if purchased, false otherwise
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to fetch course details"
    });
  }
};

export const getAllPurchasedCourses = async (req, res) => {
  try {
    const purchasedCourses = await CoursePurchase.find({
      status: "completed",
    })
      .populate({
        path: "courseId",
        match: { creator: req.id }, // filter courses where creator matches req.id
      });

    // Filter out any purchases where the courseId was not populated (creator did not match)
    const filteredPurchasedCourses = purchasedCourses.filter(
      (purchase) => purchase.courseId
    );

    if (filteredPurchasedCourses.length === 0) {
      return res.status(200).json({
        purchasedCourse: [],
      });
    }

    return res.status(200).json({
      purchasedCourse: filteredPurchasedCourses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "An error occurred while fetching purchased courses.",
    });
  }
};
