const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const shipmentRoutes = require('./routes/shipmentRoutes');

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json());

// Routes
app.use('/api/shipments', shipmentRoutes);

// Health check
app.get('/', (req, res) => res.send('Eco-Freight API Online (Vercel Edition)'));

// Connect to Database
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ Database Connection Error:', err));

// VERCEL FIX: Instead of app.listen(), we export the app!
module.exports = app;