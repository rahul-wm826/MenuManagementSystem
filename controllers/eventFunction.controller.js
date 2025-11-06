const EventFunction = require('../models/eventFunction.model');
const Event = require('../models/event.model');
const Proposal = require('../models/proposal.model');
exports.getProposalsForFunction = async (req, res) => {
    try {
        const { functionId } = req.params;
        const proposals = await Proposal.find({ eventFunctionId: functionId })
            .populate('clientId')
            .populate('eventFunctionId')
            .sort({ createdAt: -1 });
        res.status(200).json(proposals);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong.', error: error.message });
    }
};

// Get all functions for a specific event
exports.getAllFunctionsForEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const functions = await EventFunction.find({ eventId }).populate('eventId');
        res.status(200).json(functions);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong.', error: error.message });
    }
};

// Create a new function for a specific event
exports.createFunctionForEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { name, date, type, approxGuests, description } = req.body;

        if (!name || !type) {
            return res.status(400).json({ message: 'Function name and type are required' });
        }

        const eventExists = await Event.findById(eventId);
        if (!eventExists) {
            return res.status(404).json({ message: 'Parent event not found' });
        }

        const newFunction = new EventFunction({
            eventId,
            name,
            date,
            type,
            approxGuests,
            description,
        });
        const savedFunction = await newFunction.save();
        res.status(201).json(savedFunction);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong.', error: error.message });
    }
};

// Get a single function by its own ID
exports.getFunctionById = async (req, res) => {
    try {
        const func = await EventFunction.findById(req.params.id).populate('eventId');
        if (!func) {
            return res.status(404).json({ message: 'Function not found' });
        }
        res.status(200).json(func);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong.', error: error.message });
    }
};

// Update a single function by its own ID
exports.updateFunctionById = async (req, res) => {
    try {
        const { name, date, type, approxGuests, description } = req.body;
        const updatedFunction = await EventFunction.findByIdAndUpdate(
            req.params.id,
            { name, date, type, approxGuests, description },
            { new: true, runValidators: true }
        );
        if (!updatedFunction) {
            return res.status(404).json({ message: 'Function not found' });
        }
        res.status(200).json(updatedFunction);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong.', error: error.message });
    }
};

// Delete a single function by its own ID
exports.deleteFunctionById = async (req, res) => {
    try {
        const deletedFunction = await EventFunction.findByIdAndDelete(req.params.id);
        if (!deletedFunction) {
            return res.status(404).json({ message: 'Function not found' });
        }
        res.status(200).json({ message: 'Function deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong.', error: error.message });
    }
};

exports.createProposal = async (req, res) => {
  try {
    const { functionId } = req.params;
    const { name } = req.body;

    // 1. Find the parent EventFunction
    const parentFunction = await EventFunction.findById(functionId);
    if (!parentFunction) {
      return res.status(404).json({ message: 'Event function not found' });
    }

    // ** 2. Find the parent Event to get the clientId **
    const parentEvent = await Event.findById(parentFunction.eventId);
    if (!parentEvent) {
        return res.status(404).json({ message: 'Parent event not found' });
    }

    // 3. Create the new proposal
    const newProposal = new Proposal({
      name: name || 'New Proposal',
      eventFunctionId: functionId,
      clientId: parentEvent.clientId, // <-- USE THE CORRECT CLIENT ID
      status: 'Draft',
      version: 1,
      menuSections: [],
      clientComments: []
    });

    const savedProposal = await newProposal.save();
    res.status(201).json(savedProposal);

  } catch (error) {
    res.status(500).json({ message: 'Error creating proposal.', error: error.message });
  }
};