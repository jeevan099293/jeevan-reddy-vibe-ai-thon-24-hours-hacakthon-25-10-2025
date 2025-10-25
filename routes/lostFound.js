
const express = require('express');
const router = express.Router();
const LostFound = require('../models/LostFound');
const { auth } = require('../middleware/auth');

// Get all items
router.get('/', auth, async (req, res) => {
    try {
        const items = await LostFound.find().sort({ created_at: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Report item
router.post('/', auth, async (req, res) => {
    try {
        const item = new LostFound({
            ...req.body,
            user_id: req.user.user_id
        });

        await item.save();

        // Emit real-time update
        const io = req.app.get('io');
        io.emit('lost-found-update', { type: 'new', item });

        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update item
router.put('/:id', auth, async (req, res) => {
    try {
        const item = await LostFound.findById(req.params.id);
        
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Check authorization
        if (item.user_id.toString() !== req.user.user_id && !['admin', 'faculty'].includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        item.status = req.body.status || item.status;
        await item.save();

        // Emit real-time update
        const io = req.app.get('io');
        io.emit('lost-found-update', { type: 'update', item });

        res.json({ message: 'Item updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
