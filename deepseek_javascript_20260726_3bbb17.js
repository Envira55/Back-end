const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');
const { accessKeyAuth } = require('../middleware/auth');

// Public routes
router.get('/', testController.getAllTests);
router.get('/category/:category', testController.getTestsByCategory);
router.get('/:id', testController.getTestById);

// Admin routes (protected with access key)
router.post('/', accessKeyAuth, testController.createTest);
router.put('/:id', accessKeyAuth, testController.updateTest);
router.patch('/:id/price', accessKeyAuth, testController.updateTestPrice);
router.delete('/:id', accessKeyAuth, testController.deleteTest);

module.exports = router;