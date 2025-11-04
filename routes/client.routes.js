const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client.controller');
const { authenticateToken, authorizeRole } = require('../middleware/auth.middleware');

// Routes accessible to all authenticated users
router.get('/', authenticateToken, clientController.getAllClients);
router.get('/:id', authenticateToken, clientController.getClientById);

// Routes restricted to admin and sales roles
router.post('/', authenticateToken, authorizeRole(['admin', 'sales']), clientController.createClient);
router.put('/:id', authenticateToken, authorizeRole(['admin', 'sales']), clientController.updateClient);
router.delete('/:id', authenticateToken, authorizeRole(['admin', 'sales']), clientController.deleteClient);

module.exports = router;
