const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = "AIzaSyASx1kmh1ycBHo1h57KG7rsNZPC1EOfRcg";
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // There isn't a direct listModels on the client instance in some versions, 
        // but let's try to just run a simple generation to see if we can get a better error or if it works in isolation.
        // Actually, let's use the REST API to list models to be sure.

        console.log("Fetching models via REST API...");
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        console.log("Available models:", JSON.stringify(data, null, 2));

    } catch (error) {
        console.error("Error:", error);
    }
}

listModels();
