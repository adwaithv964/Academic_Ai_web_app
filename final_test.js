const { GoogleGenerativeAI } = require("@google/generative-ai");

// ⚠️ HARDCODE YOUR KEY HERE FOR THIS TEST ONLY ⚠️
const ACTUAL_KEY = "AIzaSyBRg7BHfxLO67KhhrBcz5ik11W3i08L_NI"; 

const genAI = new GoogleGenerativeAI(ACTUAL_KEY);

async function run() {
  console.log("1. Checking SDK Version...");
  try {
    const pkg = require('./package.json');
    const version = pkg.dependencies['@google/generative-ai'];
    console.log(`   SDK Version in package.json: ${version}`);
  } catch(e) { console.log("   Could not read package.json"); }

  console.log("\n2. Asking Google: 'What models can this key see?'");
  try {
    // This requires NO model name, it just tests the key permissions
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // We intentionally use a raw request to list models if possible, 
    // but since the SDK hides listModels in some versions, we'll try a simple prompt.
    const result = await model.generateContent("Are you there?");
    console.log("✅ SUCCESS! The key works.");
    console.log("   Response: " + result.response.text());
    
  } catch (error) {
    console.error("❌ FAILURE.");
    console.error("   Error Message: " + error.message);
    
    if (error.message.includes("404")) {
      console.log("\n--- ANALYSIS ---");
      console.log("The API is rejecting this specific Key for this specific Model.");
      console.log("This usually means the 'Generative Language API' is DISABLED in the Google Cloud Project associated with this key.");
    }
  }
}

run();