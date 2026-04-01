const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  createdBy: String
});

module.exports = mongoose.model("Event", EventSchema);