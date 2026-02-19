





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
        of: String, 
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
        index: true 
    }
}, {
    
});

module.exports = mongoose.model('SystemLog', systemLogSchema);
