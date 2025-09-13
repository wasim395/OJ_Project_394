const mongoose = require("mongoose");

const TestCaseSchema = new mongoose.Schema({
    input: { type: String, required: true },
    output: { type: String, required: true }
}, { _id: false });

const ProblemSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        problemStatement: {
            type: String,
            required: true,
        },
        expectedInput: {
            type: String,
            required: true,
        },
        expectedOutput: {
            type: String,
            required: true,
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
            // validate: [array => array.length > 0, "At least one test case is required"]
        },
        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard"],
            required: true,
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
            enum: ["draft", "published"],
            default: "draft"  // published only after hidden cases exist
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Problem", ProblemSchema);
