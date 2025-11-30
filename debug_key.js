const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config(); // Load your .env file

async function debug() {
  const key = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  
  if (!key) {
    console.error("❌ No API Key found in environment variables!");
    return;
  }
  
  console.log(`🔑 Testing Key: ${key.substring(0, 8)}...`);
  const genAI = new GoogleGenerativeAI(key);
  
  try {
    // This asks the API for the list of models this key can access
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    // We try a minimal generation to force an auth check
    await model.generateContent("test"); 
    console.log("✅ SUCCESS! 'gemini-1.5-flash' is working.");
  } catch (error) {
    console.error("❌ API Error Details:");
    console.error(`   Code: ${error.status || 'Unknown'}`);
    console.error(`   Message: ${error.message}`);
    
    if (error.message.includes("404")) {
        console.log("\n--- DIAGNOSIS: INVALID KEY TYPE ---");
        console.log("You are likely using a Google Cloud Vertex AI key with the AI Studio SDK.");
        console.log("SOLUTION: Go to https://aistudio.google.com/app/apikey and create a new key there.");
    }
  }
}

debug();