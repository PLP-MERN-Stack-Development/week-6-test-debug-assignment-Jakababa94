const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../controllers/userControllers');
const User = require('../models/User');

// Return active users
router.get('/', async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json({ success: true, data: users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch users' });
    }
});


router.get('/active', async (req, res) => {
    try {
        const users = await User.find({ isActive: true });
        res.json({ success: true, data: users });
    } catch (error) {
        console.error('Error fetching active users:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch active users' });
    }
});

module.exports = router;