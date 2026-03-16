import mongoose from "mongoose";
import Event from "./models/Event.js";
import Participant from "./models/Participant.js";

await mongoose.connect("mongodb://127.0.0.1:27017/eventsDB");

await Event.deleteMany();
await Participant.deleteMany();

const events = await Event.insertMany([
  { title: "React Workshop", date: new Date("2026-03-10") },
  { title: "Node.js Meetup", date: new Date("2026-03-12") },
  { title: "JavaScript Conference", date: new Date("2026-04-01") },
  { title: "Frontend Bootcamp", date: new Date("2026-02-20") },
  { title: "Backend Summit", date: new Date("2026-05-05") }
]);

await Participant.insertMany([
  { name: "Anna", email: "anna@test.com", eventId: events[0]._id },
  { name: "Ivan", email: "ivan@test.com", eventId: events[0]._id },
  { name: "Olga", email: "olga@test.com", eventId: events[1]._id }
]);

console.log("Seed completed");

process.exit();