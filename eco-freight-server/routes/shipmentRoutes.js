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
    res.status(400).json({ error: err.message });
  }
});

// GET: Fetch all shipments for the dashboard
router.get('/all', async (req, res) => {
  try {
    const shipments = await Shipment.find().sort({ createdAt: -1 });
    res.json(shipments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;