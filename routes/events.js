const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { auth, roleAuth } = require('../middleware/auth');

// Get all events
router.get('/', auth, async (req, res) => {
    try {
        const events = await Event.find().sort({ event_date: 1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create event (Faculty/Admin only)
router.post('/', auth, roleAuth('faculty', 'admin'), async (req, res) => {
    try {
        const event = new Event({
            ...req.body,
            created_by: req.user.user_id
        });

        await event.save();

        // Emit real-time notification
        const io = req.app.get('io');
        io.emit('new-event', event);

        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Register for event
router.post('/:id/register', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.registered_users.includes(req.user.user_id)) {
            return res.status(400).json({ message: 'Already registered' });
        }

        event.registered_users.push(req.user.user_id);
        await event.save();

        // Emit real-time update
        const io = req.app.get('io');
        io.emit('event-registration', { eventId: event._id, count: event.registered_users.length });

        res.json({ message: 'Registration successful!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
