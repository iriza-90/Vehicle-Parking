const express = require('express');
const router = express.Router();
const { createParkingSlot, getAllParkingSlots } = require('../controller/parkingController');

router.post('/parking/create', createParkingSlot);  // POST /api/parking-slots
router.get('/parking', getAllParkingSlots);  // GET  /api/parking-slots

module.exports = router;
