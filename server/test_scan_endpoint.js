





const fs = require('fs');
const path = require('path');


if (fs.existsSync('test_image.png')) {
    fs.unlinkSync('test_image.png');
}


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






if (typeof fetch !== 'undefined' && typeof FormData !== 'undefined') {
    runTest();
} else {
    console.log("Environment does not support fetch/FormData. Please test manually via UI.");
}
