const mongoose = require('mongoose');
module.exports = mongoose.model('Event', new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  fee: { type: Number, default: 0 },
  seats: { type: Number, required: true, min: 0 },
  date: Date
}));
