const express = require('express');
const { getAllUsers, getDashboardDataById, updateDashboardDataById, addBooksToDashboard } = require('../controllers/admin.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Route to get all users (admin only)
router.get('/getUsers', authMiddleware, getAllUsers);

// Route to get dashboard data by ID (admin only)
router.get('/dashboardDataById/:id', authMiddleware, getDashboardDataById);

// Route to update dashboard data by ID (admin only)
router.put('/dashboardDataById/:id', authMiddleware, updateDashboardDataById);

// Route to add books to dashboard data by ID (admin only)
router.post('/dashboardDataById/:id/books', addBooksToDashboard);

module.exports = router;