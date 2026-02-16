const mongoose = require('mongoose');

const systemLogSchema = new mongoose.Schema({
    level: {
        type: String,
        enum: ['INFO', 'WARNING', 'ERROR', 'SUCCESS'],
        default: 'INFO',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    details: {
        type: Map,
        of: String, // e.g., { "key": "value" }
        default: {}
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    ip: {
        type: String,
        required: false
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true // Index for sorting
    }
}, {
    // No timestamps: true needed because we have timestamp field
});

module.exports = mongoose.model('SystemLog', systemLogSchema);
