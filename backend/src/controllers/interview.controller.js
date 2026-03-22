
import * as pdfParseModule from "pdf-parse";
const pdfParse = pdfParseModule.default ?? pdfParseModule;
import generateInterviewReport, { generateHtmlFromAi } from "../services/ai.service.js";
import interviewReportModel from "../models/interviewReport.model.js";
import { generatePdfFromHtml } from "../services/generatePDF.service.js";


export const interviewReportController = async(req, res) =>{
    const resumeText=null;
    if(res.file){
        const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
        resumeText = resumeContent.text;
    }
    
    const { selfDescription, jobDescription } = req.body
    
    const interViewReportByAi = await generateInterviewReport({
        resume: resumeText,
        selfDescription,
        jobDescription
    })

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeText,
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
    const {id} = req.params;
    const interviewReportDetails = await interviewReportModel.findById(id);
    if(!interviewReportDetails){
        return res.status(404).json({message:"Such Interview  does not exists"})
    }
    const {resume, jobDescription, selfDescription} = interviewReportDetails;
    const gotTheHTML = await generateHtmlFromAi({ jobDescription, resume, selfDescription });
    const nowGotPage = await generatePdfFromHtml(gotTheHTML.html);
     res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
    return res.send(nowGotPage);
};
