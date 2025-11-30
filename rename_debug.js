const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\adwai\\Downloads\\All project Works\\Arijith_and_team\\implementation\\test\\academic_result_predictor\\public';
const old1 = path.join(dir, 'logo512_1764522227168.png');
const new1 = path.join(dir, 'logo512.png');
const old2 = path.join(dir, 'logo192_1764522242085.png');
const new2 = path.join(dir, 'logo192.png');

console.log('Directory:', dir);
console.log('Old1:', old1);
console.log('New1:', new1);

try {
    if (fs.existsSync(old1)) {
        console.log('Found logo512, renaming...');
        fs.renameSync(old1, new1);
        console.log('Renamed logo512');
    } else {
        console.log('logo512 not found');
        const files = fs.readdirSync(dir);
        console.log('Files in directory:', files);
    }

    if (fs.existsSync(old2)) {
        console.log('Found logo192, renaming...');
        fs.renameSync(old2, new2);
        console.log('Renamed logo192');
    } else {
        console.log('logo192 not found');
    }
} catch (e) {
    console.error('Error:', e);
}
