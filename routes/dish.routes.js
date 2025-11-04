const express = require('express');
const router = express.Router();
const dishController = require('../controllers/dish.controller');
const { authenticateToken, authorizeRole } = require('../middleware/auth.middleware');

// Routes are in order of the plan
router.post('/', authenticateToken, authorizeRole(['admin', 'chef']), dishController.createDish);
router.get('/', authenticateToken, dishController.getAllDishes);
router.get('/:id', authenticateToken, dishController.getDishById);
router.put('/:id', authenticateToken, authorizeRole(['admin', 'chef']), dishController.updateDish);
router.delete('/:id', authenticateToken, authorizeRole(['admin', 'chef']), dishController.deleteDish);

module.exports = router;
