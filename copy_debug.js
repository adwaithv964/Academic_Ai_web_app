const fs = require('fs');

const src1 = 'C:\\Users\\adwai\\.gemini\\antigravity\\brain\\4f137aff-31ea-480d-9ac6-bfb7f57f6512\\logo512_1764522227168.png';
const dest1 = 'c:\\Users\\adwai\\Downloads\\All project Works\\Arijith_and_team\\implementation\\test\\academic_result_predictor\\public\\logo512.png';

const src2 = 'C:\\Users\\adwai\\.gemini\\antigravity\\brain\\4f137aff-31ea-480d-9ac6-bfb7f57f6512\\logo192_1764522242085.png';
const dest2 = 'c:\\Users\\adwai\\Downloads\\All project Works\\Arijith_and_team\\implementation\\test\\academic_result_predictor\\public\\logo192.png';

const manifest = 'c:\\Users\\adwai\\Downloads\\All project Works\\Arijith_and_team\\implementation\\test\\academic_result_predictor\\public\\manifest.json';

try {
    console.log('Reading logo512...');
    const data1 = fs.readFileSync(src1);
    console.log('Writing logo512...');
    fs.writeFileSync(dest1, data1);
    console.log('Copied logo512');

    console.log('Reading logo192...');
    const data2 = fs.readFileSync(src2);
    console.log('Writing logo192...');
    fs.writeFileSync(dest2, data2);
    console.log('Copied logo192');

    if (fs.existsSync(manifest)) {
        console.log('Deleting manifest...');
        fs.unlinkSync(manifest);
        console.log('Deleted manifest');
    }
} catch (e) {
    console.error('Error:', e);
}
