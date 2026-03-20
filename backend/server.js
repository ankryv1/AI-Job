import "./src/config/env.js";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import generateInterviewReport from "./src/services/ai.service.js";
import interviewReportModel from "./src/models/interviewReport.model.js";

connectDB();

// generateInterviewReport({resume: "Ankit, CS Student at RTU Kota, MERN Stack Developer, built ToDesktop clone.",
//     selfDescription: "I am a full-stack developer passionate about AI and scalable web apps.",
//     jobDescription: "Looking for a MERN Stack Intern with knowledge of Node.js and MongoDB."});

app.listen(5000, ()=>{
    console.log("server Started");
})

