const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const shipmentRoutes = require('./routes/shipmentRoutes');

const app = express();

// Middleware
// cors() without options allows all origins, which is perfect for letting Vercel connect
app.use(cors()); 
app.use(express.json());

// Routes
app.use('/api/shipments', shipmentRoutes);

// Health check route so Render knows the server is awake
app.get('/', (req, res) => res.send('Eco-Freight API Online'));

// Define the port for Render (or 5001 for local)
const PORT = process.env.PORT || 5001;

// Cloud DB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error('❌ Database Connection Error:', err));