import mongoose from "mongoose";

const interviewReportSchema = new mongoose.Schema({
  jobDescription: {
    type: String,
    required: [true, "Job description is required"],
  },
  resume: {
    type: String,
  },
  selfDescription: {
    type: String,
  },
  matchScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  technicalQuestions: [
    {
      question: {
        type: String,
        required: [true, "Question is required"],
      },
      answer: {
        type: String,
        required: [true, "Answer is required"],
      },
      intention: {
        type: String,
        required: [true, "Intention is required"],
      },
    },
  ],
  behavioralQuestions: [
    {
      question: {
        type: String,
        required: [true, "Question is required"],
      },
      answer: {
        type: String,
        required: [true, "Answer is required"],
      },
      intention:{type: String}
    },
  ],
  skillGaps: [
    {
      skill: {
        type: String,
        required: [true, "Skill is required"],
      },
      severity: {
        type: String,
        required: [true, "Severity is required"],
        enum: ["low", "medium", "high"],
      },
    },
  ],

  preparationPlan:[{
    day: Number,
    focus: { type: String },
    tasks: [{
        type: String,
        required:[true, "Tasks are required"]
    }]
  }],
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
  title: { type: String },
},{timestamps:true});

const interviewReportModel = mongoose.model("InterviewModel", interviewReportSchema);

export default interviewReportModel;