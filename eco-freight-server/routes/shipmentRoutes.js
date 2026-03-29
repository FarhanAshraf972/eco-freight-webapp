const express = require('express');
const router = express.Router();
const Shipment = require('../models/Shipment');

// POST: Create a new shipment
router.post('/add', async (req, res) => {
  try {
    const newShipment = new Shipment(req.body);
    const savedShipment = await newShipment.save();
    res.status(201).json(savedShipment);
  } catch (err) {
    console.error("❌ Error saving shipment:", err);
    
    // Check if MongoDB is throwing a "Duplicate Key" error (like a duplicate Order ID)
    if (err.code === 11000) {
      return res.status(400).json({ error: "Order ID already exists. Please try again to generate a new one." });
    }

    // Catch any other errors
    res.status(400).json({ error: err.message || "An unexpected error occurred while saving." });
  }
});

// GET: Fetch all shipments for the dashboard
router.get('/all', async (req, res) => {
  try {
    const shipments = await Shipment.find().sort({ createdAt: -1 });
    res.json(shipments);
  } catch (err) {
    console.error("❌ Error fetching shipments:", err);
    res.status(500).json({ error: "Failed to fetch shipments from the database." });
  }
});

module.exports = router;