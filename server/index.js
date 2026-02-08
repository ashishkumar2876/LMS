import express from 'express';
import dotenv from 'dotenv';
import connectDB from './database/dbConnect.js';
import userRoute from './routes/user.route.js';
import courseRoute from './routes/course.route.js'
import mediaRoute from './routes/media.route.js'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import purchaseRoute from './routes/purchaseCourse.routes.js'
import courseProgressRoute from './routes/courseProgress.route.js'
import { stripeWebhook } from './controllers/coursePurchase.controller.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({});

connectDB();

const app=express();

const PORT=process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const _dirname = path.resolve(__dirname, '..');

// ⚠️ CRITICAL: Webhook route MUST be before express.json() to receive raw body
// Stripe webhooks require raw body for signature verification

// Test endpoint to verify webhook route is accessible
app.get("/api/v1/purchase/webhook/test", (req, res) => {
  res.json({ 
    message: "Webhook endpoint is accessible",
    timestamp: new Date().toISOString(),
    url: req.url
  });
});

// Stripe webhook endpoint
app.post("/api/v1/purchase/webhook", express.raw({type:"application/json"}), (req, res) => {
  console.log("=== WEBHOOK ROUTE HIT ===");
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  console.log("Headers present:", !!req.headers);
  stripeWebhook(req, res);
});

app.use(express.json());
app.use(cors({
    origin: "https://lms-1-sh7o.onrender.com",
    credentials:true
}));
app.use(cookieParser());

//api aaegi
app.use("/api/v1/user",userRoute);
app.use("/api/v1/course",courseRoute);
app.use("/api/v1/media",mediaRoute);
app.use("/api/v1/purchase",purchaseRoute);
app.use("/api/v1/progress",courseProgressRoute);


app.use(express.static(path.join(_dirname,'client/dist')))
app.get('*',(req,res)=>{
    res.sendFile(path.resolve(_dirname,'client','dist','index.html'));
})
app.listen(PORT,()=>{
    console.log(`Server listen on port ${PORT}`);
})