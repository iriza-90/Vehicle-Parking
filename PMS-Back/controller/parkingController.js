const { ParkingSlot } = require('../models');

// Create a new parking slot
exports.createParkingSlot = async (req, res) => {
  try {
    const slot = await ParkingSlot.create(req.body);
    res.status(201).json(slot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all parking slots
exports.getAllParkingSlots = async (req, res) => {
  try {
    const slots = await ParkingSlot.findAll();
    res.status(200).json(slots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
