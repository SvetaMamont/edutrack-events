import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: String,
  date: Date
});

// індекси для швидкого пошуку і сортування
eventSchema.index({ date: 1 });
eventSchema.index({ title: 1 });

export default mongoose.model("Event", eventSchema);