const mongoose = require("mongoose");

// Metrics Schema
const metricsSchema = new mongoose.Schema({
  profit: {
    value: { type: Number, required: true, default: 0 },
    increase: { type: String, required: true, default: "0%" },
  },
  sales: {
    value: { type: Number, required: true, default: 0 },
    increase: { type: String, required: true, default: "0%" },
  },
  payments: {
    value: { type: Number, required: true, default: 0 },
    decrease: { type: String, required: true, default: "0%" },
  },
  transactions: {
    value: { type: Number, required: true, default: 0 },
    increase: { type: String, required: true, default: "0%" },
  },
});

// Chart Data Schema
const chartDataSchema = new mongoose.Schema({
  labels: { type: [String], required: true, default: [] },
  data: { type: [Number], required: true, default: [] },
});

// Charts Schema
const chartsSchema = new mongoose.Schema({
  totalRevenue: { type: chartDataSchema, required: true, default: () => ({}) },
  growth: { type: chartDataSchema, required: true, default: () => ({}) },
  profileReport: {
    labels: { type: [String], required: true, default: [] },
    data: { type: [Number], required: true, default: [] },
    increase: { type: String, required: true, default: "0%" },
  },
});

// Orders Schema
const ordersSchema = new mongoose.Schema({
  totalOrders: { type: Number, required: true, default: 0 },
  categories: { type: [String], required: true, default: [] },
});

// Books Schema
const booksSchema = new mongoose.Schema({
  bookName: { type: String, required: true },
  mrp: { type: Number, required: true },
  quantityLeft: { type: Number, required: true },
  royaltyEarned: { type: Number, required: true },
  booksSold: { type: Number, required: true },
});

// Dashboard Schema
const dashboardSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    email: { type: String, required: true },
    metrics: { type: metricsSchema, required: true, default: () => ({}) },
    charts: { type: chartsSchema, required: true, default: () => ({}) },
    orders: { type: ordersSchema, required: true, default: () => ({}) },
    transactions: { type: [Object], required: true, default: [] },
    orderStatistics: {
      totalSales: { type: Number, required: true, default: 0 },
      totalOrders: { type: Number, required: true, default: 0 },
      categories: { type: [String], required: true, default: [] },
    },
    badges: { type: [String], required: true, default: [] },
    books: { type: [booksSchema], required: true, default: [] },
  },
  { timestamps: true }
);

const Dashboard = mongoose.model("Dashboard", dashboardSchema);

module.exports = Dashboard;