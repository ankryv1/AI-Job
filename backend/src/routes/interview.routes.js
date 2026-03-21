import express from 'express'
import { authMiddlewear } from '../middlewear/auth.middlewear.js';
import { getAllInterviewReportController, getInterviewReportByIdController, interviewReportController } from '../controllers/interview.controller.js';
import upload from '../middlewear/multer.middlewear.js';
import { generateAiPdf } from '../services/ai.service.js';

const router = express.Router();

router.post("/report", authMiddlewear,upload.single("resume"), interviewReportController);
router.get("/get-all", authMiddlewear, getAllInterviewReportController);
router.get("/getBy/:id", authMiddlewear, getInterviewReportByIdController)
router.post("/generate-resume", authMiddlewear, upload.single("resume"), generateAiPdf)

export default router;
