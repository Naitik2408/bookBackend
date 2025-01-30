const User = require('../models/user.model');
const Dashboard = require('../models/dashboard.model');

// Controller to get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Controller to get dashboard data by ID
const getDashboardDataById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    const dashboardData = await Dashboard.findOne({ userId: id });

    if (!dashboardData) {
      return res.status(404).json({ error: 'Dashboard data not found' });
    }

    res.status(200).json(dashboardData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

// Controller to update dashboard data by ID
const updateDashboardDataById = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    const updatedDashboardData = await Dashboard.findOneAndUpdate(
      { userId: id },
      { $set: updateData },
      { new: true }
    );

    if (!updatedDashboardData) {
      return res.status(404).json({ error: 'Dashboard data not found' });
    }

    res.status(200).json(updatedDashboardData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update dashboard data' });
  }
};

// Controller to add books to dashboard data by ID
const addBooksToDashboard = async (req, res) => {
  try {
    const { id } = req.params;
    const { books } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    const dashboardData = await Dashboard.findOne({ userId: id });

    if (!dashboardData) {
      return res.status(404).json({ error: 'Dashboard data not found' });
    }

    dashboardData.books.push(...books);
    await dashboardData.save();

    res.status(200).json(dashboardData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add books to dashboard data' });
  }
};

module.exports = {
  getAllUsers,
  getDashboardDataById,
  updateDashboardDataById,
  addBooksToDashboard,
};