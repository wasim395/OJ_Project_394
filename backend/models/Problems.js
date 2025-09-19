const mongoose = require("mongoose");

const TestCaseSchema = new mongoose.Schema({
    input: { type: String, required: true },
    output: { type: String, required: true }
});

const ProblemSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
        },
        problemStatement: {
            type: String,
        },
        expectedInput: {
            type: String,
        },
        expectedOutput: {
            type: String,
        },
        constraints: {
            type: [String],
            default: []
        },
        sampleTestCases: {
            type: [TestCaseSchema],
            default: []
        },
        hiddenTestCases: {
            type: [TestCaseSchema],
            default: [],
        },
        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard"],
            index: true,
        },
        tags: {
            type: [String],
            default: [],
            index: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            reqired: true,
        },
        status: {
            type: String,
            enum: ["draft", "validated", "published"],
            default: "draft",
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Problem", ProblemSchema);
