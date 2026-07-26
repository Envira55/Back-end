const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { adminAuth } = require('../middleware/auth');

router.post('/login', adminController.login);
router.post('/register', adminAuth, adminController.createAdmin);
router.get('/dashboard', adminAuth, adminController.getDashboardStats);

module.exports = router;