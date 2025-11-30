const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\adwai\\Downloads\\All project Works\\Arijith_and_team\\implementation\\test\\academic_result_predictor\\public';
const old1 = path.join(dir, 'logo512_1764522227168.png');
const new1 = path.join(dir, 'logo512.png');
const old2 = path.join(dir, 'logo192_1764522242085.png');
const new2 = path.join(dir, 'logo192.png');

try {
    if (fs.existsSync(old1)) {
        fs.renameSync(old1, new1);
        console.log('Renamed logo512');
    } else {
        console.log('logo512 not found (might be already renamed)');
    }

    if (fs.existsSync(old2)) {
        fs.renameSync(old2, new2);
        console.log('Renamed logo192');
    } else {
        console.log('logo192 not found (might be already renamed)');
    }
} catch (e) {
    console.error(e);
}
