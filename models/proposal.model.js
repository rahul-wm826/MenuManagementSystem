const mongoose = require('mongoose');

// Sub-schema for individual menu items (snapshots of dishes)
const menuItemSchema = new mongoose.Schema({
  dishId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dish',
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  images: {
    type: [String],
  },
}, { _id: false }); // No separate _id for menu items

// Sub-schema for menu sections (e.g., "Appetizers")
const menuSectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  items: [menuItemSchema],
}, { _id: false }); // No separate _id for menu sections

// Sub-schema for client comments
const clientCommentSchema = new mongoose.Schema({
    author: {
        type: String,
    },
    comment: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const proposalSchema = new mongoose.Schema({
  eventFunctionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EventFunction',
    required: true,
  },
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
    enum: ['Draft', 'Sent', 'Revisions Requested', 'Approved', 'Cancelled'],
    default: 'Draft',
  },
  version: {
    type: Number,
    default: 1,
  },
  clientComments: [clientCommentSchema],
  menuSections: [menuSectionSchema],
}, { timestamps: true }); // Add createdAt and updatedAt timestamps

const Proposal = mongoose.model('Proposal', proposalSchema);

module.exports = Proposal;
