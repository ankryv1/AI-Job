import { GoogleGenAI } from "@google/genai";
import { jsonrepair } from "jsonrepair";

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
Resume: ${safeResume}
Self: ${selfDescription}
Job: ${jobDescription}
`;

  const response = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  let parsed;

  // ✅ Step 1: Try normal parse
  try {
    parsed = JSON.parse(response.text);
  } catch (err) {
    console.log("⚠️ Broken JSON, repairing...");
    try {
      const fixed = jsonrepair(response.text);
      parsed = JSON.parse(fixed);
    } catch (e) {
      console.error("❌ Still invalid JSON:", response.text);
      throw new Error("AI response parsing failed");
    }
  }

  // ✅ Step 2: Normalize (VERY IMPORTANT)
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

    preparationPlan: fixArray(data.preparationPlan, [
      "day",
      "focus",
      "tasks",
    ]),
  };
}

// 🔥 Handles both correct + broken AI arrays
function fixArray(arr, keys) {
  if (!Array.isArray(arr)) return [];

  // ✅ Case 1: Already correct
  if (typeof arr[0] === "object") {
    return arr;
  }

  // ❌ Case 2: Broken flat array → convert
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

export default generateInterviewReport;