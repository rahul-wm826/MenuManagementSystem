const Proposal = require('../models/proposal.model');
const EventFunction = require('../models/eventFunction.model');
const Event = require('../models/event.model');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');

// Helper function to generate a PDF buffer
const generatePdfBuffer = async (proposalId) => {
    const proposal = await Proposal.findById(proposalId);
    if (!proposal) {
        throw new Error('Proposal not found');
    }

    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);

        // Add content to the PDF
        doc.fontSize(25).text(proposal.name, { align: 'center' });
        doc.moveDown();

        proposal.menuSections.forEach(section => {
            doc.fontSize(20).font('Helvetica-Bold').text(section.title);
            doc.moveDown(0.5);

            section.items.forEach(item => {
                doc.fontSize(14).font('Helvetica').text(item.name);
                if (item.description) {
                    doc.fontSize(12).font('Helvetica-Oblique').text(item.description);
                }
                doc.moveDown();
            });
        });

        doc.end();
    });
};

// Create a new proposal linked to an event function
exports.createProposal = async (req, res) => {
    try {
        const { functionId } = req.params;
        const { name, status, version, clientComments, menuSections } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Proposal name is required' });
        }

        const eventFunction = await EventFunction.findById(functionId);
        if (!eventFunction) {
            return res.status(404).json({ message: 'Event function not found' });
        }

        const parentEvent = await Event.findById(eventFunction.eventId);
        if (!parentEvent) {
            return res.status(404).json({ message: 'Parent event not found' });
        }

        const newProposal = new Proposal({
            eventFunctionId: functionId,
            clientId: parentEvent.clientId,
            name,
            status,
            version,
            clientComments,
            menuSections,
        });

        const savedProposal = await newProposal.save();
        res.status(201).json(savedProposal);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong.', error: error.message });
    }
};

// Get a single proposal by its ID
exports.getProposalById = async (req, res) => {
    try {
        const proposal = await Proposal.findById(req.params.id)
            .populate('eventFunctionId')
            .populate('clientId');
        if (!proposal) {
            return res.status(404).json({ message: 'Proposal not found' });
        }
        res.status(200).json(proposal);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong.', error: error.message });
    }
};

// Update a proposal by its ID
exports.updateProposal = async (req, res) => {
    try {
        const updatedProposal = await Proposal.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedProposal) {
            return res.status(404).json({ message: 'Proposal not found' });
        }
        res.status(200).json(updatedProposal);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong.', error: error.message });
    }
};

// Add a comment to a proposal
exports.addCommentToProposal = async (req, res) => {
    try {
        const { author, comment } = req.body;
        if (!comment) {
            return res.status(400).json({ message: 'Comment text is required' });
        }
        const updatedProposal = await Proposal.findByIdAndUpdate(
            req.params.id,
            { $push: { clientComments: { author, comment } } },
            { new: true, runValidators: true }
        );
        if (!updatedProposal) {
            return res.status(404).json({ message: 'Proposal not found' });
        }
        res.status(200).json(updatedProposal);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong.', error: error.message });
    }
};

// Get all proposals for a specific client
exports.getProposalsByClient = async (req, res) => {
    try {
        const { clientId } = req.params;
        const proposals = await Proposal.find({ clientId }).populate('eventFunctionId');
        res.status(200).json(proposals);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong.', error: error.message });
    }
};

// Export a proposal as a PDF
exports.exportPdf = async (req, res) => {
    try {
        const proposal = await Proposal.findById(req.params.id);
         if (!proposal) {
            return res.status(404).json({ message: 'Proposal not found' });
        }
        const pdfBuffer = await generatePdfBuffer(req.params.id);

        res.setHeader('Content-Disposition', `attachment; filename="${proposal.name || 'proposal'}.pdf"`);
        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfBuffer);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong.', error: error.message });
    }
};

// Email a proposal as a PDF
exports.emailProposal = async (req, res) => {
    try {
        const { toEmail, message } = req.body;
        if (!toEmail) {
            return res.status(400).json({ message: 'Recipient email is required' });
        }

        const proposal = await Proposal.findById(req.params.id);
        if (!proposal) {
            return res.status(404).json({ message: 'Proposal not found' });
        }

        const pdfBuffer = await generatePdfBuffer(req.params.id);

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: toEmail,
            subject: `Proposal: ${proposal.name}`,
            text: message || 'Please find the attached proposal.',
            attachments: [
                {
                    filename: `${proposal.name || 'proposal'}.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf',
                },
            ],
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Email Error:', error);
        res.status(500).json({ message: 'Failed to send email.', error: error.message });
    }
};
