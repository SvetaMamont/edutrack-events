import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
  name: String,
  email: String,
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event"
  }
});

// індекс для швидкого пошуку учасників події
participantSchema.index({ eventId: 1 });

export default mongoose.model("Participant", participantSchema);