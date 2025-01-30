const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const router = express.Router();

// Route to create a new dashboard entry for the logged-in user
router.post('/', dashboardController.createDashboard);

// Route to get dashboard data for the logged-in user
router.get('/', dashboardController.getDashboardData);

module.exports = router;