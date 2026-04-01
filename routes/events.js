const express = require("express");
const Event = require("../models/Event");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, async (req,res)=>{

 const event = new Event(req.body);

 await event.save();

 res.json(event);

});

module.exports = router;

router.get("/", async (req,res)=>{

 const page = parseInt(req.query.page) || 1
 const limit = 10

 const skip = (page - 1) * limit

 const events = await Event.find()
   .skip(skip)
   .limit(limit)

 res.json(events)

});