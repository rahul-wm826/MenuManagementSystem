const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['Potential', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Potential',
  },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
