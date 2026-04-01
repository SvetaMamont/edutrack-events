const mongoose = require("mongoose");

const ParticipantSchema = new mongoose.Schema({
  name: String,
  email: String,
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Participant", ParticipantSchema);