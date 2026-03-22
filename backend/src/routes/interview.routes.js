import express from 'express'
import { authMiddlewear } from '../middlewear/auth.middlewear.js';
import { generateResumeByAiController, getAllInterviewReportController, getInterviewReportByIdController, interviewReportController } from '../controllers/interview.controller.js';
import upload from '../middlewear/multer.middlewear.js';

const router = express.Router();

router.post("/report", authMiddlewear,upload.single("resume"), interviewReportController);
router.get("/get-all", authMiddlewear, getAllInterviewReportController);
router.get("/getBy/:id", authMiddlewear, getInterviewReportByIdController)
router.post("/generate-resume/:id", authMiddlewear,  generateResumeByAiController)

export default router;
