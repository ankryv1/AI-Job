import express from 'express';
import authRouter from './routes/auth.route.js';
import cookieParser from "cookie-parser";
import cors from 'cors'
import interviewRouter from '../src/routes/interview.routes.js'


const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"https://ai-5musa78ou-ankryv1s-projects.vercel.app",
    credentials: true
}))

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);


export default app;