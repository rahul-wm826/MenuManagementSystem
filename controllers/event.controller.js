const Event = require('../models/event.model');
const Client = require('../models/client.model');

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const { clientId, name, status } = req.body;
    if (!clientId || !name) {
      return res.status(400).json({ message: 'Client ID and event name are required' });
    }
    const clientExists = await Client.findById(clientId);
    if (!clientExists) {
        return res.status(404).json({ message: 'Client not found' });
    }
    const newEvent = new Event({ clientId, name, status });
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.', error: error.message });
  }
};

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('clientId');
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.', error: error.message });
  }
};

// Get a single event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('clientId');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.', error: error.message });
  }
};

// Update an event by ID
exports.updateEvent = async (req, res) => {
  try {
    const { clientId, name, status } = req.body;
    if (clientId) {
        const clientExists = await Client.findById(clientId);
        if (!clientExists) {
            return res.status(404).json({ message: 'Client not found' });
        }
    }
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { clientId, name, status },
      { new: true, runValidators: true }
    );
    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.', error: error.message });
  }
};

// Delete an event by ID
exports.deleteEvent = async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    // Optional: Also delete all associated EventFunctions
    // await EventFunction.deleteMany({ eventId: req.params.id });
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.', error: error.message });
  }
};
