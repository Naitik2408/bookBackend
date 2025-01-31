const Dashboard = require("../models/dashboard.model");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

// Helper function to get the logged-in user's ID from the token
const getUserIdFromToken = (req) => {
  let token = req.cookies.token; // Get the token from cookies
  if (!token) {
    token = req.headers['x-access-token']; // Get the token from headers
  }
  if (!token) {
    throw new Error("No token found");
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
  return decoded._id; // Return the user ID from the token
};

// Create a new dashboard entry for the logged-in user
const createDashboard = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req); // Get the logged-in user's ID
    const user = await User.findById(userId); // Fetch the user's details
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if a dashboard already exists for this user
    const existingDashboard = await Dashboard.findOne({ userId });
    if (existingDashboard) {
      return res.status(400).json({ message: "Dashboard already exists for this user." });
    }

    // Create a new dashboard entry
    const newDashboard = new Dashboard({
      userId,
      email: user.email,
      metrics: req.body.metrics || {
        profit: { value: 0, increase: "0%" },
        sales: { value: 0, increase: "0%" },
        payments: { value: 0, decrease: "0%" },
        transactions: { value: 0, increase: "0%" },
      },
      charts: req.body.charts || {
        totalRevenue: { labels: [], data: [] },
        growth: { labels: [], data: [] },
        profileReport: { labels: [], data: [], increase: "0%" },
      },
      orders: req.body.orders || {
        totalOrders: 0,
        categories: [],
      },
      transactions: req.body.transactions || [],
      orderStatistics: req.body.orderStatistics || {
        totalSales: 0,
        totalOrders: 0,
        categories: [],
      },
      badges: req.body.badges || [],
    });

    await newDashboard.save(); // Save the new dashboard entry
    res.status(201).json({ success: true, data: newDashboard });
  } catch (error) {
    console.error("Error creating dashboard:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Get dashboard data for the logged-in user
const getDashboardData = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req); // Get the logged-in user's ID
    console.log("userId", userId);
    
    // Fetch dashboard data for the specified userId
    const dashboard = await Dashboard.findOne({ userId }).populate("userId");

    if (!dashboard) {
      return res.status(404).json({ message: "Dashboard data not found for this user." });
    }

    // Return the dashboard data
    res.status(200).json({ success: true, data: dashboard });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ success: false, message: "Internal server error.", error });
  }
};

// Update dashboard data for the logged-in user
const updateDashboard = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req); // Get the logged-in user's ID

    // Find the dashboard by userId and update it
    const updatedDashboard = await Dashboard.findOneAndUpdate(
      { userId },
      {
        $set: {
          metrics: req.body.metrics,
          charts: req.body.charts,
          orders: req.body.orders,
          transactions: req.body.transactions,
          orderStatistics: req.body.orderStatistics,
          badges: req.body.badges,
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedDashboard) {
      return res.status(404).json({ message: "Dashboard data not found for this user." });
    }

    // Return the updated dashboard data
    res.status(200).json({ success: true, data: updatedDashboard });
  } catch (error) {
    console.error("Error updating dashboard data:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

module.exports = {
  createDashboard,
  getDashboardData,
  updateDashboard,
};