# AI Resume Analyzer & Generator

A full-stack application that analyzes a candidate’s resume against a job description,self Description and generates a 
personalized interview questions,Technical Questions,provides Roadmap along with a job-specific resume.


## Features

- Upload resume (PDF/DOCX) OR write Self Description
- Give Job Description Target
- Analyze resume using AI (Gemini API)
- Generate match score based on job description
- Generate technical and behavioral interview questions
- Identify skill gaps
- Provide a preparation plan
- Generate job-specific resume
- Download resume as PDF

---

## Tech Stack

Frontend:
- React.js
- SCSS
- Axios
- React Router

Backend:
- Node.js
- Express.js
- MongoDB (Mongoose)
- Multer (file upload)
- pdf-parse (resume parsing)
- Puppeteer (for PDF generation)
- Zod (for Schema validation)

AI:
- Google Gemini API

---


File Structure-
#  BACKEND

-src
 -controllers
 -services
 -routes
 -config
 -middlewears
 -models


A MERN-based AI application that analyzes resumes,job Description and self Description generates interview questions, 
and creates job-specific resumes using Gemini API.

