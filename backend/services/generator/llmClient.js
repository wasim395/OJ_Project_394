const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

const llm = new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY, // put this in .env
    // model: "gemini-2.5-flash",
    model: "gemini-2.5-pro",
    temperature: 0,
});

async function callLLM(prompt, retries = 3) {
    try {
        console.log("Calling LLM with prompt...");
        const response = await llm.invoke(prompt);
        console.log("LLM response received.");
        return response?.content || "";
    } catch (error) {
        console.error("LLM API error:", error.message);

        if (retries > 0) {
            console.log(`Retrying... attempts left: ${retries}`);
            await new Promise(resolve => setTimeout(resolve, 2000)); // wait 2s
            return callLLM(prompt, retries - 1);
        }

        throw new Error("Failed to generate content from LLM after retries");
    }
}

module.exports = { callLLM };
