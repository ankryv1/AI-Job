import { GoogleGenAI } from "@google/genai";
import { jsonrepair } from "jsonrepair";
import {z} from 'zod';
import {zodToJsonSchema} from 'zod-to-json-schema'

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  // 🔥 Trim large input (VERY IMPORTANT)
  const safeResume = resume?.slice(0, 3000);

  let candidateInfo='';
  if(safeResume) candidateInfo+= `Resume: ${safeResume}\n`;
  if(selfDescription) candidateInfo+=`SelfDescription: ${selfDescription}\n`


  const prompt = `
Return ONLY valid JSON.

Structure:

{
  "matchScore": number,
  "title": string,
  "technicalQuestions": [
    { "question": string, "intention": string, "answer": string }
  ],
  "behavioralQuestions": [
    { "question": string, "intention": string, "answer": string }
  ],
  "skillGaps": [
    { "skill": string, "severity": "low" | "medium" | "high" }
  ],
  "preparationPlan": [
    { "day": number, "focus": string, "tasks": string[] }
  ]
}

RULES:
- No duplicate keys
- Arrays must contain objects (NOT strings)
- Minimum 3 items in each array
- Do NOT add explanation text

DATA:
${candidateInfo},
Job: ${jobDescription}
`;

  const response = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  let parsed;

  try {
    parsed = JSON.parse(response.text);
  } catch (err) {
    console.log(" Broken JSON, repairing...");
    try {
      const fixed = jsonrepair(response.text);
      parsed = JSON.parse(fixed);
    } catch (e) {
      console.error(" Still invalid JSON:", response.text);
      throw new Error("AI response parsing failed");
    }
  }

  const normalized = normalizeAIResponse(parsed);

  return normalized;
}

function normalizeAIResponse(data) {
  return {
    matchScore: data.matchScore || 0,
    title: data.title || "Unknown Role",

    technicalQuestions: fixArray(data.technicalQuestions, [
      "question",
      "intention",
      "answer",
    ]),

    behavioralQuestions: fixArray(data.behavioralQuestions, [
      "question",
      "intention",
      "answer",
    ]),

    skillGaps: fixArray(data.skillGaps, ["skill", "severity"]),

    preparationPlan: fixArray(data.preparationPlan, ["day", "focus", "tasks"]),
  };
}

function fixArray(arr, keys) {
  if (!Array.isArray(arr)) return [];

  if (typeof arr[0] === "object") {
    return arr;
  }

  const result = [];

  for (let i = 0; i < arr.length; i += keys.length) {
    const obj = {};
    keys.forEach((key, index) => {
      obj[key] = arr[i + index];
    });
    result.push(obj);
  }

  return result;
}

export const generateHtmlFromAi = async ({ jobDescription, resume, selfDescription }) => {
 
  const HTMLschema = z.object({
    html: z.string().describe( "Make a HTML for it that can be easily converted to PDF by puppeteer",),
  });

  const prompt = `Generate a html which can be converted to PDF by puppeteer and take reference from the jobDescription,selfDescription and resume provided by the user
                  ${jobDescription},
                  ${resume},
                  ${selfDescription}
                  the response should be in JSON format with a single html field, and make sure it should be within 1 page only, and highlight key points
                  `

  const response = await genAI.models.generateContent({model: 'gemini-2.5-flash',
                                                      contents: prompt,
                                                      config: {
                                                        responseMimeType:"application/json",
                                                        responseSchema: zodToJsonSchema(HTMLschema)
                                                      }});
    //  console.log(response.text);  
     const data = JSON.parse(response.text);
     return data;                                              


};

export default generateInterviewReport;
