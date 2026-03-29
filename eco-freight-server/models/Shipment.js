const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  weightKg: { type: Number, required: true },
  distanceKm: { type: Number, required: true },
  transportMode: { 
    type: String, 
    enum: ['Air', 'Heavy Truck', 'Cargo Ship', 'Rail'], 
    required: true 
  },
  carbonEmitted: { type: Number },
  suggestedSavings: { type: Number, default: 0 }, 
  suggestedMode: { type: String, default: '' }, // NEW: Stores 'Rail' or 'Cargo Ship'
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

// PRE-SAVE HOOK: Smart Geographic Emisson Logic
shipmentSchema.pre('save', function() {
  const factors = { 
    'Air': 0.500, 
    'Heavy Truck': 0.105, 
    'Cargo Ship': 0.015, 
    'Rail': 0.025 
  };
  
  const weightInTons = this.weightKg / 1000;
  const currentFactor = factors[this.transportMode] || 0.1;
  
  // 1. Calculate current emissions
  this.carbonEmitted = parseFloat((weightInTons * this.distanceKm * currentFactor).toFixed(2));

  // 2. SMART GREEN ROUTE LOGIC
  // If distance < 2500km, assume Land (Suggest Rail). Else assume Overseas (Suggest Ship).
  const optimalMode = this.distanceKm < 2500 ? 'Rail' : 'Cargo Ship';
  const optimalFactor = factors[optimalMode];
  
  if (currentFactor > optimalFactor) {
    const potentialEmissions = weightInTons * this.distanceKm * optimalFactor;
    this.suggestedSavings = parseFloat((this.carbonEmitted - potentialEmissions).toFixed(2));
    this.suggestedMode = optimalMode; // Save the specific suggestion to the DB
  } else {
    this.suggestedSavings = 0;
    this.suggestedMode = '';
  }
});

module.exports = mongoose.model('Shipment', shipmentSchema);