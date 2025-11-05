const express = require('express');
const router = express.Router();
const proposalController = require('../controllers/proposal.controller');
const { authenticateToken, authorizeRole } = require('../middleware/auth.middleware');

// Public route for clients
router.get('/proposals/public/:token', proposalController.getPublicProposalByToken);

// Routes for operating on a single proposal by its ID
router.get('/:id', authenticateToken, proposalController.getProposalById);
router.put('/:id', authenticateToken, authorizeRole(['admin', 'sales']), proposalController.updateProposal);

// Route for adding a comment to a proposal
router.post('/:id/comments', authenticateToken, authorizeRole(['admin', 'sales']), proposalController.addCommentToProposal);

// Route for exporting a proposal as a PDF
router.get('/:id/export/pdf', authenticateToken, proposalController.exportPdf);

// Route for emailing a proposal
router.post('/:id/email', authenticateToken, authorizeRole(['admin', 'sales']), proposalController.emailProposal);

module.exports = router;
