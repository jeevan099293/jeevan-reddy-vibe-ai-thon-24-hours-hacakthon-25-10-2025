const mongoose = require('mongoose');

const lostFoundSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    user_name: String,
    type: {
        type: String,
        enum: ['lost', 'found'],
        required: true
    },
    item_name: {
        type: String,
        required: true
    },
    description: String,
    category: String,
    location: String,
    date: String,
    contact: String,
    image_url: String,
    status: {
        type: String,
        default: 'active'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('LostFound', lostFoundSchema);
