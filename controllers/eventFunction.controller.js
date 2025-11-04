const EventFunction = require('../models/eventFunction.model');
const Event = require('../models/event.model');

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
