const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');
const eventFunctionController = require('../controllers/eventFunction.controller');
const { authenticateToken, authorizeRole } = require('../middleware/auth.middleware');

// Standard CRUD for Events
router.post('/', authenticateToken, authorizeRole(['admin', 'sales']), eventController.createEvent);
router.get('/', authenticateToken, eventController.getAllEvents);
router.get('/:id', authenticateToken, eventController.getEventById);
router.put('/:id', authenticateToken, authorizeRole(['admin', 'sales']), eventController.updateEvent);
router.delete('/:id', authenticateToken, authorizeRole(['admin', 'sales']), eventController.deleteEvent);

// Nested routes for Event Functions
router.get('/:eventId/functions', authenticateToken, eventFunctionController.getAllFunctionsForEvent);
router.post('/:eventId/functions', authenticateToken, authorizeRole(['admin', 'sales']), eventFunctionController.createFunctionForEvent);

module.exports = router;
