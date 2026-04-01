const express = require("express");
const Participant = require("../models/Participant");

const router = express.Router();

router.get("/registrations", async (req,res)=>{

 const data = await Participant.aggregate([
   {
     $group:{
       _id:{ $dateToString:{format:"%Y-%m-%d",date:"$createdAt"}},
       count:{ $sum:1 }
     }
   }
 ])

 res.json(data)

});

module.exports = router;