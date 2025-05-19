const express = require('express');
const router = express.Router();
const vehicleController = require('../controller/vehicleController');
const authMiddleware = require('../middlewares/authMiddleware');

// CRUD + search
/**
 * @swagger
 * tags:
 *   name: Vehicles
 *   description: Endpoints for managing vehicles
 */

/**
 * @swagger
 * /vehicles/create:
 *   post:
 *     summary: Create a new vehicle
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vehicle'
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Validation error
 */
router.post('/create', authMiddleware.verifyToken, vehicleController.create);

/**
 * @swagger
 * /vehicles:
 *   get:
 *     summary: Get all vehicles for a user
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of vehicles
 */
router.get('/', authMiddleware.verifyToken, vehicleController.getAll);

/**
 * @swagger
 * /vehicles/{id}:
 *   get:
 *     summary: Get vehicle by ID
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vehicle found
 *       404:
 *         description: Vehicle not found
 */
router.get('/:id', authMiddleware.verifyToken, vehicleController.getById);

/**
 * @swagger
 * /vehicles/update/{id}:
 *   put:
 *     summary: Update a vehicle
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vehicle'
 *     responses:
 *       200:
 *         description: Vehicle updated
 *       404:
 *         description: Not found
 */
router.put('/update/:id', authMiddleware.verifyToken, vehicleController.update);

/**
 * @swagger
 * /vehicles/delete/{id}:
 *   delete:
 *     summary: Delete a vehicle
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Vehicle deleted
 *       404:
 *         description: Not found
 */
router.delete('/delete/:id', authMiddleware.verifyToken, vehicleController.delete);

/**
 * @swagger
 * /vehicles/search:
 *   get:
 *     summary: Search vehicles
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/search', authMiddleware.verifyToken, vehicleController.search);

router.put('/:id/checkout', authMiddleware.verifyToken, vehicleController.checkout);

module.exports = router;

