import Exam from "../models/Exam.js";
import User from "../models/User.js";
import mongoose from "mongoose"; // Import mongoose for ObjectId validation

// ✅ Create a new exam (Only for Instructors)
export const createExam = async (req, res) => {
  try {
    if (req.user.role !== "instructor") {
      return res.status(403).json({ success: false, message: "Only instructors can create exams" });
    }

    const { title, code, subject, category, timeLimit, totalMarks, numberOfQuestions, examType } = req.body;

    // Validate required fields
    if (!title || !code || !subject || !category || !timeLimit || !totalMarks || !numberOfQuestions || !examType) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Additional validation (example)
    if (typeof timeLimit !== "number" || typeof totalMarks !== "number" || typeof numberOfQuestions !== "number") {
      return res.status(400).json({ success: false, message: "timeLimit, totalMarks, and numberOfQuestions must be numbers" });
    }

    // Check if exam code is unique
    const existingExam = await Exam.findOne({ code });
    if (existingExam) {
      return res.status(400).json({ success: false, message: "Exam code already exists" });
    }

    const examData = {
      title,
      code,
      subject,
      category,
      timeLimit,
      totalMarks,
      numberOfQuestions,
      examType,
      createdBy: req.user._id,
    };
    const exam = new Exam(examData);
    await exam.save();

    res.status(201).json({ success: true, message: "Exam created successfully", data: exam });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: process.env.NODE_ENV === "development" ? error.message : undefined });
  }
};

// ✅ Get all exams
export const getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find().populate("createdBy", "name email");
    res.status(200).json({ success: true, data: exams });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: process.env.NODE_ENV === "development" ? error.message : undefined });
  }
};

// ✅ Get single exam by ID
export const getExamById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid exam ID" });
    }

    const exam = await Exam.findById(req.params.id).populate("createdBy", "name email");
    if (!exam) {
      return res.status(404).json({ success: false, message: "Exam not found" });
    }
    res.status(200).json({ success: true, data: exam });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: process.env.NODE_ENV === "development" ? error.message : undefined });
  }
};

// ✅ Update an exam (Only for Instructors)
export const updateExam = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid exam ID" });
    }

    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ success: false, message: "Exam not found" });
    }

    if (req.user.role !== "instructor" || exam.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Only the instructor who created this exam can update it" });
    }

    const updatedExam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, message: "Exam updated successfully", data: updatedExam });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: process.env.NODE_ENV === "development" ? error.message : undefined });
  }
};