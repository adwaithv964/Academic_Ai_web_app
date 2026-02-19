





const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const path = require('path');


const envPath = path.join(__dirname, '../.env');
console.log("Loading env from:", envPath);
dotenv.config({ path: envPath });

const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
console.log("API Key present:", !!apiKey);


const models = [
    'gemini-2.5-flash',
    'gemini-2.0-flash-exp',
    'gemini-1.5-pro',
    'gemini-1.5-flash'
];

async function testModel(modelName) {
    console.log(`\nTesting model: ${modelName}`);
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: modelName });
        const prompt = "Return a JSON array with one event: { title: 'Test Event', date: '2025-01-01' }";

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("Success! Response:", text);
        return true;
    } catch (error) {
        console.error(`Failed: ${error.message}`);
        return false;
    }
}

async function run() {
    if (!apiKey) {
        console.error("No API key found!");
        return;
    }

    for (const model of models) {
        await testModel(model);
    }
}

run();
