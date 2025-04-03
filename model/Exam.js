import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    code: { type: String, unique: true, required: true, index: true }, // Indexed for faster lookups
    subject: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    timeLimit: { type: Number, required: true, min: 1 }, // In minutes, no negative/zero values
    totalMarks: { type: Number, required: true, min: 1 },
    numberOfQuestions: { type: Number, required: true, min: 1 },
    examType: {
      type: String,
      enum: ["Practice Test", "Certification Exam"],
      required: true,
    },

    questions: [
      {
        questionText: { type: String, required: true, trim: true },
        options: {
          type: [{ type: String, required: true, trim: true }],
          validate: {
            validator: (options) => options.length >= 2, // At least 2 options
            message: "A question must have at least 2 options",
          },
        },
        correctAnswer: { type: String, required: true, trim: true },
        marks: { type: Number, required: true, min: 0 },
        difficulty: {
          type: String,
          enum: ["Easy", "Medium", "Hard"],
          required: true,
        },
        explanation: { type: String, trim: true },
      },
    ],

    randomizeQuestions: { type: Boolean, default: false },
    sections: [
      {
        name: { type: String, required: true, trim: true },
        duration: { type: Number, required: true, min: 1 }, // Minutes
      },
    ],

    negativeMarking: { type: Boolean, default: false },
    secretCode: { type: String, unique: true, index: true }, // Indexed for faster lookups

    accessControl: {
      registeredStudentsOnly: { type: Boolean, default: true },
      expiryDate: { type: Date },
      attemptsLimit: { type: Number, default: 1, min: 1 },
      restrictCopyPaste: { type: Boolean, default: true },
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Index for faster population and lookups
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Ensure unique indexes are enforced
examSchema.index({ code: 1 }, { unique: true });
examSchema.index({ secretCode: 1 }, { unique: true, sparse: true }); // Sparse for optional secretCode

const Exam = mongoose.model("Exam", examSchema);
export default Exam;