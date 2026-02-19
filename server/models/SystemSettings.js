





const mongoose = require('mongoose');

const systemSettingsSchema = new mongoose.Schema({
    maintenanceMode: {
        type: Boolean,
        default: false
    },
    allowRegistration: {
        type: Boolean,
        default: true
    },
    systemEmail: {
        type: String,
        default: 'admin@academicpredictor.com'
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });


systemSettingsSchema.statics.getInstance = async function () {
    let settings = await this.findOne();
    if (!settings) {
        settings = await this.create({});
    }
    return settings;
};

module.exports = mongoose.model('SystemSettings', systemSettingsSchema);
