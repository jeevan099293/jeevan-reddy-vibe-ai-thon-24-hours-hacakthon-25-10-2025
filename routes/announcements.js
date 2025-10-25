const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const { auth, roleAuth } = require('../middleware/auth');

// Get announcements
router.get('/', auth, async (req, res) => {
    try {
        const announcements = await Announcement.find()
            .sort({ created_at: -1 })
            .limit(10);
        res.json(announcements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create announcement (Admin/Faculty only)
router.post('/', auth, roleAuth('admin', 'faculty'), async (req, res) => {
    try {
        const announcement = new Announcement(req.body);
        await announcement.save();

        // Emit real-time notification to all users
        const io = req.app.get('io');
        io.emit('new-announcement', announcement);

        res.status(201).json(announcement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
