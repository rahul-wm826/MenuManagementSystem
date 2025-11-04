const express = require('express');
const router = express.Router();
const eventFunctionController = require('../controllers/eventFunction.controller');
const { authenticateToken, authorizeRole } = require('../middleware/auth.middleware');

// Routes for operating on a single function by its own ID
router.get('/:id', authenticateToken, eventFunctionController.getFunctionById);
router.put('/:id', authenticateToken, authorizeRole(['admin', 'sales']), eventFunctionController.updateFunctionById);
router.delete('/:id', authenticateToken, authorizeRole(['admin', 'sales']), eventFunctionController.deleteFunctionById);

module.exports = router;
