
import * as pdfParseModule from "pdf-parse";
const pdfParse = pdfParseModule.default ?? pdfParseModule;
import generateInterviewReport, { generateAiPdf } from "../services/ai.service.js";
import interviewReportModel from "../models/interviewReport.model.js";
import { generatePdfFromHtml } from "../services/generatePDF.service.js";


export const interviewReportController = async(req, res) =>{

    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
    const { selfDescription, jobDescription } = req.body

    const interViewReportByAi = await generateInterviewReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    })

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        ...interViewReportByAi
    })

    res.status(201).json({
        message: "Interview report generated successfully.",
        interviewReport
    })

}



export const getAllInterviewReportController = async(req, res) =>{
    const allReports = await interviewReportModel.find({}).select("-jobDescription -resume -selfDescription ");
    if(allReports.length==0){
        return res.status(400).json({message:"No data found"})
    }
    return res.status(200).json({message:"Successfully fetched", Reports: allReports});
}

export const getInterviewReportByIdController = async(req, res) =>{
    const {id} = req.params;
    if(!id){
        return res.status(400).json({message:"Id Required",})
    }
    const interviewReportById = await interviewReportModel.findById(id);
    if(!interviewReportById){
        return res.status(400).json({message:"id is not valid"}).select("-jobDescription -resume -selfDescription ")
    }
    return res.status(200).json({message:"Successfully fetched", Reports: interviewReportById});
}

export const generateResumeByAiController = async(req, res) =>{
    const {jobDescription, selfDescription} = req.body;
    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
    const gotTheHTML =  generateAiPdf({ jobDescription, resume, selfDescription });
    const nowGotPage = generatePdfFromHtml(gotTheHTML);
    return res.status(200).json({message:"yes i got tthe pdf generation", })
}