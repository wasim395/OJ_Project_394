const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

const llm = new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY, // put this in .env
    model: "gemini-2.5-flash",
    temperature: 0,
});

async function callLLM(prompt) {
    try {
        const response = await llm.invoke(prompt);
        return response?.content || "";
    } catch (error) {
        console.error("LLM API error:", error.message);
        throw new Error("Failed to generate content from LLM");
    }
}

module.exports = { callLLM };
