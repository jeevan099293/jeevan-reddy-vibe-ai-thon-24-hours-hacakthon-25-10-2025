const express = require('express');
const router = express.Router();
const Club = require('../models/Club');
const { auth, roleAuth } = require('../middleware/auth');

// Get all clubs
router.get('/', auth, async (req, res) => {
    try {
        const clubs = await Club.find().sort({ name: 1 });
        res.json(clubs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create club (Faculty/Admin only)
router.post('/', auth, roleAuth('faculty', 'admin'), async (req, res) => {
    try {
        const club = new Club(req.body);
        await club.save();

        // Emit real-time notification
        const io = req.app.get('io');
        io.emit('new-club', club);

        res.status(201).json(club);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Join club
router.post('/:id/join', auth, async (req, res) => {
    try {
        const club = await Club.findById(req.params.id);
        
        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }

        if (club.members.includes(req.user.user_id)) {
            return res.status(400).json({ message: 'Already a member' });
        }

        club.members.push(req.user.user_id);
        await club.save();

        // Emit real-time update
        const io = req.app.get('io');
        io.emit('club-join', { clubId: club._id, memberCount: club.members.length });

        res.json({ message: 'Joined club successfully!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
