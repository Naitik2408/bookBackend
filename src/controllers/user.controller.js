const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const Dashboard = require('../models/dashboard.model');

// Create a new user
exports.createUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        console.log('Request body:', req.body); // Log the request body

        // Validate required fields
        if (!username || !email || !password) {
            console.log('Validation failed: Missing required fields');
            return res.status(400).send({ error: 'Please provide all required fields' });
        }
        
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists:', email);
            return res.status(400).send({ error: 'User already exists' });
        }
        
        // Create and save the new user
        const user = new User({
            username,
            email,
            password,
            role // Set the role from the request body
        });
        const savedUser = await user.save();
        if(!savedUser) {
            console.log('Error saving user');
            return res.status(500).send({ error: 'Failed to save user' });
        }

        // Create a new dashboard entry for the user with default values
        const dashboard = new Dashboard({
            userId: user._id,
            email: user.email,
            metrics: {
                profit: { value: 0, increase: "0%" },
                sales: { value: 0, increase: "0%" },
                payments: { value: 0, decrease: "0%" },
                transactions: { value: 0, increase: "0%" },
            },
            charts: {
                totalRevenue: { labels: [], data: [] },
                growth: { labels: [], data: [] },
                profileReport: { labels: [], data: [], increase: "0%" },
            },
            orders: {
                totalOrders: 0,
                categories: [],
            },
            transactions: [],
            orderStatistics: {
                totalSales: 0,
                totalOrders: 0,
                categories: [],
            },
            badges: [],
        });
        await dashboard.save();
        console.log('Dashboard saved:', dashboard);

        // Generate auth token
        const token = await user.generateAuthToken();
        console.log('Token generated:', token);

        res.status(201).send({ user, token });
    } catch (error) {
        console.error('Error creating user:', error); // Log the error
        res.status(500).send({ error: 'Failed to create user', details: error.message });
    }
};

// Login a user
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ error: 'Please provide email and password' });
        }

        const user = await User.findByCredentials(email, password);
        const token = await user.generateAuthToken();

        // Set the token in a cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: true
        });

        res.send({ user, token });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

// Logout a user
exports.logoutUser = async (req, res) => {
    try {
        // Clear the token cookie
        res.clearCookie('token');
        res.send({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).send({ error: 'Failed to logout' });
    }
};

// Verify token and provide user data
exports.verifyToken = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).send({ error: 'Not authenticated' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        res.send({ user, token });
    } catch (error) {
        res.status(401).send({ error: 'Invalid token' });
    }
};