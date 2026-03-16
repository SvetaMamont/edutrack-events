import express from "express"
import { connectDB } from "./db.js"

import Event from "./models/Event.js"
import Participant from "./models/Participant.js"

const app = express()
const PORT = 3000

await connectDB()

app.use(express.json())

app.get("/events", async (req, res) => {

  try {

    const { cursor, limit = 5, sort = "date" } = req.query

    const query = {}

    if (cursor) {
      query._id = { $gt: cursor }
    }

    const events = await Event
      .find(query)
      .sort({ [sort]: 1 })
      .limit(Number(limit))

    const nextCursor = events.length
      ? events[events.length - 1]._id
      : null

    res.json({
      data: events,
      nextCursor
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }

})

app.get("/participants/:eventId", async (req, res) => {

  try {

    const participants = await Participant.find({
      eventId: req.params.eventId
    })

    res.json(participants)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }

})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})