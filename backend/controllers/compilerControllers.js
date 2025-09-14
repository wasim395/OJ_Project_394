const Problems = require("../models/Problems.js");
const { generateFile } = require("../generateFile.js");
const { executeCpp } = require("../executeCpp.js");
const { generateInputFile } = require("../generateInputFile.js");
const User = require("../models/User");

// -------------------- RUN (for quick execution) --------------------
const run = async (req, res) => {
    const { language = "cpp", code, input = "" } = req.body;

    if (!code) {
        return res.status(400).json({
            success: false,
            error: "Empty Code Box",
        });
    }

    try {
        const filePath = await generateFile(language, code);
        const fileInputPath = await generateInputFile(input);
        const output = await executeCpp(filePath, fileInputPath);

        return res.json({
            success: true,
            output: output.trim(),
        });
    } catch (error) {
        console.error("Runtime error:", error);
        return res.status(500).json({
            success: false,
            error: error.toString(),
        });
    }
};

// -------------------- STORE SUBMISSION HISTORY --------------------
const storeSubmissionHistory = async (user, problemId, verdict, score, code) => {
    const currentTimeInSeconds = Math.floor(Date.now() / 1000).toString();

    user.submissionHistory.push({
        problemId,
        verdict,
        score,
        submissionTime: currentTimeInSeconds,
        code,
    });

    await user.save();

    console.log("Submission stored:", {
        problemId,
        verdict,
        score,
        submissionTime: currentTimeInSeconds,
    });
};

// -------------------- SUBMIT (with sample + hidden test cases) --------------------
const submit = async (req, res) => {
    try {
        const problemId = req.params.id;
        const { language = "cpp", code } = req.body;

        if (!code) {
            return res.status(400).json({
                success: false,
                error: "Empty Code Box",
            });
        }

        const problem = await Problems.findById(problemId);
        if (!problem) {
            return res.status(404).json({
                success: false,
                error: "Problem not found",
            });
        }

        // ✅ Use both sample + hidden test cases
        const testCases = [
            ...(problem.sampleTestCases || []),
            ...(problem.hiddenTestCases || []),
        ];

        if (testCases.length === 0) {
            return res.status(400).json({
                success: false,
                error: "No test cases found for this problem",
            });
        }

        const filePath = await generateFile(language, code);

        let correct = 0;
        let verdict = "ACCEPTED";
        let total = testCases.length;
        let failedCase = null;

        for (const test of testCases) {
            const fileInputPath = await generateInputFile(test.input);
            let generatedOutput;

            try {
                generatedOutput = await executeCpp(filePath, fileInputPath);
            } catch (error) {
                if (error === "TLE") {
                    await storeSubmissionHistory(req.user, problemId, "TLE", `${correct}/${total}`, code);
                    return res.json({ verdict: "TLE", correct, total });
                }
                if (error === "Error") {
                    await storeSubmissionHistory(req.user, problemId, "RUNTIME ERROR", `${correct}/${total}`, code);
                    return res.json({ verdict: "RUNTIME ERROR", correct, total });
                }
                console.error("Unexpected error while running test case:", error);
                return res.status(500).json({ success: false, error: error.toString() });
            }

            const expectedOutput = test.output;

            if (generatedOutput.trim() !== expectedOutput.trim()) {
                verdict = "WRONG ANSWER";
                failedCase = {
                    input: test.input,
                    expected: expectedOutput,
                    actual: generatedOutput,
                };
                break;
            }

            correct++;
        }

        await storeSubmissionHistory(req.user, problemId, verdict, `${correct}/${total}`, code);

        return res.json({
            verdict,
            correct,
            total,
            failedCase, // ✅ shows debug info when wrong
        });
    } catch (error) {
        console.error("Error while submitting:", error);
        return res.status(500).json({
            success: false,
            error: error.toString(),
        });
    }
};

module.exports = {
    run,
    submit,
};
