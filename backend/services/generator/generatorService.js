import fs from "fs";
import path from "path";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-pro",
    temperature: 0,
    apiKey: process.env.GEMINI_API_KEY,
    max_tokens: null,
    timeout: null,
    max_retries: 2
});

const DRAFT_FILE = path.join(process.cwd(), "tmp/problem_draft.json");

async function generateProblem({ difficulty = "easy", tags = [] }) {
    const systemPrompt = `You are a competitive data structure and algorithms problem setter.
Return ONLY valid JSON matching this schema, NO MARKDOWN, NO EXTRA TEXT:

{
  "title": "string",
  "statement": "string",
  "input_format": "string",
  "output_format": "string",
  "samples": [ {"input":"string","output":"string"} ]
}`;

    const userPrompt = `Create a ${difficulty} difficulty problem about ${tags.join(", ")} with 2 sample testcases. Return ONLY valid JSON.`;

    // Call Gemini via ChatGoogleGenerativeAI
    const aiMsg = await llm.call([
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
    ]);

    let raw = aiMsg.text?.trim();

    // Strip markdown code blocks if present
    raw = raw.replace(/```json/g, "").replace(/```/g, "").trim();

    // Save raw draft locally
    fs.writeFileSync(DRAFT_FILE, raw, "utf-8");

    // Parse JSON
    let parsed;
    try {
        parsed = JSON.parse(raw);
    } catch (err) {
        throw new Error("Gemini returned invalid JSON: " + err.message + "\nRaw text:\n" + raw);
    }

    // Map to your ProblemSchema
    const mapped = {
        title: parsed.title || null,
        problemStatement: parsed.statement || null,
        expectedInput: parsed.input_format || null,
        expectedOutput: parsed.output_format || null,
        testCase: (parsed.samples || []).map(s => ({
            input: s.input,
            output: s.output
        })),
        createdBy: "system"
    };

    return { mapped, file: DRAFT_FILE };
}

export { generateProblem };
