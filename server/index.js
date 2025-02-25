import express from 'express';
import dotenv from 'dotenv';
import connectDB from './database/dbConnect.js';
import userRoute from './routes/user.route.js'
import cors from 'cors'
import cookieParser from 'cookie-parser';
dotenv.config({});

connectDB();

const app=express();

const PORT=process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use(cookieParser());

//api aaegi
app.use("/api/v1/user",userRoute)

app.listen(PORT,()=>{
    console.log(`Server listen on port ${PORT}`);
})