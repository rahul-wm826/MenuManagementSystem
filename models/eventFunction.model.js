const mongoose = require('mongoose');

const eventFunctionSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
  },
  type: {
    type: String,
    required: true,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Hi-Tea', 'Cocktail', 'Other'],
  },
  approxGuests: {
    type: Number,
  },
  description: {
    type: String,
  },
});

const EventFunction = mongoose.model('EventFunction', eventFunctionSchema);

module.exports = EventFunction;
