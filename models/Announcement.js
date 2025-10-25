const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    message: String,
    priority: {
        type: String,
        enum: ['normal', 'high'],
        default: 'normal'
    },
    created_by: String,
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Announcement', announcementSchema);
