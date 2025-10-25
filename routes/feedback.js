const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const { auth, roleAuth } = require('../middleware/auth');

// Get feedback (Admin/Faculty only)
router.get('/', auth, roleAuth('admin', 'faculty'), async (req, res) => {
    try {
        const feedback = await Feedback.find().sort({ created_at: -1 });
        res.json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Submit feedback
router.post('/', auth, async (req, res) => {
    try {
        const feedback = new Feedback({
            ...req.body,
            user_id: req.user.user_id
        });

        await feedback.save();

        // Emit real-time notification to admins
        const io = req.app.get('io');
        io.emit('new-feedback', feedback);

        res.status(201).json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update feedback (Admin/Faculty only)
router.put('/:id', auth, roleAuth('admin', 'faculty'), async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            {
                status: req.body.status,
                response: req.body.response
            },
            { new: true }
        );

        // Emit real-time update
        const io = req.app.get('io');
        io.emit('feedback-update', feedback);

        res.json({ message: 'Feedback updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
