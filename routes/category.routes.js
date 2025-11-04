const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authenticateToken, authorizeRole } = require('../middleware/auth.middleware');

// Public routes
router.get('/', authenticateToken, categoryController.getAllCategories);
router.get('/:id', authenticateToken, categoryController.getCategoryById);

// Protected routes for admin and chef
router.post('/', authenticateToken, authorizeRole(['admin', 'chef']), categoryController.createCategory);
router.put('/:id', authenticateToken, authorizeRole(['admin', 'chef']), categoryController.updateCategory);
router.delete('/:id', authenticateToken, authorizeRole(['admin', 'chef']), categoryController.deleteCategory);

module.exports = router;
