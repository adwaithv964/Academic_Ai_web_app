const https = require('https');
const apiKey = 'AIzaSyB8KdZXtkaRTvNPq0plxedBNzuwY4RBh0Y'; // Your API key
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      
      if (result.error) {
        console.error("API Error:", result.error.message);
        return;
      }

      console.log("✅ Available Models:");
      // Show all models first
      result.models.forEach(m => console.log(`- ${m.name}`));
      
      console.log("\n🔍 Flash Models:");
      // Filter for flash models to see exact names
      const flashModels = result.models.filter(m => m.name.includes("flash"));
      if (flashModels.length === 0) {
        console.log("No flash models found");
      } else {
        flashModels.forEach(m => console.log(`- ${m.name}`));
      }
      
    } catch (error) {
      console.error("Parse Error:", error);
      console.log("Raw response:", data);
    }
  });
}).on('error', (error) => {
  console.error("Network Error:", error);
});
