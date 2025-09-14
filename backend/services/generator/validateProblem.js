const { generateFile } = require("../../generateFile");
const { generateInputFile } = require("../../generateInputFile");
const { executeCpp } = require("../../executeCpp");
const fs = require("fs");

function normalize(str) {
    return String(str).replace(/\r\n/g, "\n").trim();
}

async function validateProblem(problem, solutionCode) {
    const allTestCases = [...(problem.sampleTestCases || []), ...(problem.hiddenTestCases || [])];
    const results = [];

    // compile solution only once
    const codePath = await generateFile("cpp", solutionCode);

    for (const tc of allTestCases) {
        const inputPath = await generateInputFile(tc.input);

        try {
            const output = await executeCpp(codePath, inputPath);
            const passed = normalize(output) === normalize(tc.output);

            results.push({
                input: tc.input,
                expected: tc.output,
                actual: output,
                passed
            });
        } catch (err) {
            results.push({
                input: tc.input,
                expected: tc.output,
                error: err.toString(),
                passed: false
            });
        } finally {
            // cleanup input files
            try { fs.unlinkSync(inputPath); } catch {}
        }
    }

    const allPassed = results.every(r => r.passed);
    return { allPassed, results };
}

module.exports = { validateProblem };
