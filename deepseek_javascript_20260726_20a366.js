const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { accessKeyAuth } = require('../middleware/auth');

// Public route - patient report lookup
router.get('/patient', reportController.getPatientReport);

// Admin routes
router.post('/', accessKeyAuth, reportController.createReport);
router.get('/', accessKeyAuth, reportController.getAllReports);
router.get('/:id', accessKeyAuth, reportController.getReportById);
router.patch('/:id/status', accessKeyAuth, reportController.updateReportStatus);

module.exports = router;