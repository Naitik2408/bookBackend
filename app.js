const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./database');
const dotenv = require('dotenv');
const userRoutes = require('./src/routes/user.route');
const dashboardRoutes = require('./src/routes/dashboard.routes');
const adminRoutes = require('./src/routes/admin.routes');

// Load environment variables
dotenv.config();

// Initialize the Express app
const app = express();

// Middleware setup
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser()); // Parse cookies

// Connect to the database
connectDB();

// Example route
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

// User routes
app.use('/api/users', userRoutes);

// Dashboard routes
app.use('/api/dashboard', dashboardRoutes);

app.use('/api/admin', adminRoutes);

// Export the app to be used by the server
module.exports = app;