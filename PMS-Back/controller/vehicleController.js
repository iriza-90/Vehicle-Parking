const { Vehicle } = require('../models');
const { Op, Sequelize } = require('sequelize');
const { format } = require('date-fns');

// Get all vehicles (user-specific, with pagination)
exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Vehicle.findAndCountAll({
      where: { UserId: req.user.id },
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      total: count,
      page: parseInt(page),
      vehicles: rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single vehicle by ID (user-specific)
exports.getById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({
      where: {
        id: req.params.id,
        UserId: req.user.id
      }
    });

    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Create a new vehicle (attach to current user)
const now = format(new Date(), 'yyyy-MM-dd HH:mm:ss'); 
exports.create = async (req, res) => {
  try {
    const { owner, plate, vehicleType, color, timeIn, timeOut, slotAssigned, status } = req.body;

    if (!plate || !vehicleType) {
      return res.status(400).json({ error: 'Plate and vehicleType are required' });
    }

    const vehicle = await Vehicle.create({
      owner,
      plate,
      vehicleType,
      color,
      timeIn:now,
      timeOut,
      slotAssigned,
      status,
      UserId: req.user.id
    });

    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a vehicle (only if it belongs to current user)
exports.update = async (req, res) => {
  try {
    const [updated] = await Vehicle.update(req.body, {
      where: {
        id: req.params.id,
        UserId: req.user.id
      }
    });

    if (updated === 0) {
      return res.status(404).json({ error: 'Vehicle not found or not authorized' });
    }

    const updatedVehicle = await Vehicle.findOne({
      where: { id: req.params.id, UserId: req.user.id }
    });

    res.json(updatedVehicle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a vehicle (only if it belongs to current user)
exports.delete = async (req, res) => {
  try {
    const deleted = await Vehicle.destroy({
      where: {
        id: req.params.id,
        UserId: req.user.id
      }
    });

    if (deleted === 0) {
      return res.status(404).json({ error: 'Vehicle not found or not authorized' });
    }

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.checkout = async (req, res) => {
  try {
    const { id } = req.params;

    // Find vehicle by ID
    const vehicle = await Vehicle.findByPk(id);

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    if (vehicle.status === 'checked_out') {
      return res.status(400).json({ error: 'Vehicle already checked out' });
    }

    // Set timeOut to current time and update status
    vehicle.timeOut = format(new Date(), 'yyyy-MM-dd HH:mm:ss'); // or new Date().toISOString()
    vehicle.status = 'checked_out';

    await vehicle.save();

    res.status(200).json({ message: 'Vehicle checked out successfully', vehicle });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'An error occurred while checking out the vehicle.' });
  }
};

// Search vehicles (user-specific, flexible query)
exports.search = async (req, res) => {
  try {
    const { q } = req.query;

    const vehicles = await Vehicle.findAll({
      where: {
        UserId: req.user.id,
        [Op.or]: [
          { plate: { [Op.iLike]: `%${q}%` } },
          { vehicleType: { [Op.iLike]: `%${q}%` } },
          { status: { [Op.iLike]: `%${q}%` } },
          { slotAssigned: { [Op.iLike]: `%${q}%` } },
          Sequelize.where(
            Sequelize.cast(Sequelize.col('createdAt'), 'TEXT'),
            { [Op.iLike]: `%${q}%` }
          )
        ]
      }
    });

    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
