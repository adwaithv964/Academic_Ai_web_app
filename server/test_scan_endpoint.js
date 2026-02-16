const fs = require('fs');
const path = require('path');

// clean up previous run
if (fs.existsSync('test_image.png')) {
    fs.unlinkSync('test_image.png');
}

// Create a dummy image file for testing
const dummyImage = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
fs.writeFileSync('test_image.png', dummyImage);

async function runTest() {
    console.log("Testing /api/ai-scan endpoint...");

    const formData = new FormData();
    const fileBlob = new Blob([dummyImage], { type: 'image/png' });
    formData.append('file', fileBlob, 'test_image.png');

    try {
        const response = await fetch('http://localhost:5002/api/ai-scan', {
            method: 'POST',
            body: formData
        });

        const text = await response.text();
        console.log("Status:", response.status);

        try {
            const json = JSON.parse(text);
            console.log("Response JSON:", JSON.stringify(json, null, 2));

            if (json.success && Array.isArray(json.events)) {
                console.log("✅ PASSED: Valid events returned.");
            } else {
                console.log("❌ FAILED: Invalid response structure.");
            }
        } catch (e) {
            console.log("Response Text:", text);
            console.log("❌ FAILED: Could not parse response as JSON.");
        }

    } catch (error) {
        console.error("❌ Request Failed:", error.message);
    }
}

// We can't really run this easily without a running server and fetch with FormData in node (requires node 18+ or polyfills)
// So we'll mainly use this for manual review or if we had a proper test setup.
// A simpler way for the user might be to just try the UI.
// But let's try to run it if the environment supports it.

if (typeof fetch !== 'undefined' && typeof FormData !== 'undefined') {
    runTest();
} else {
    console.log("Environment does not support fetch/FormData. Please test manually via UI.");
}
