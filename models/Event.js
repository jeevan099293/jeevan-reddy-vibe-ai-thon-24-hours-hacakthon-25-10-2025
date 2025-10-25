const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    creator_name: String,
    title: {
        type: String,
        required: true
    },
    description: String,
    event_date: String,
    event_time: String,
    location: String,
    category: String,
    image_url: String,
    max_participants: {
        type: Number,
        default: 0
    },
    registered_users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        default: 'upcoming'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Event', eventSchema);
