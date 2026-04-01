const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req,res)=>{

 const {email,password} = req.body;

 const hashedPassword = await bcrypt.hash(password,10);

 const user = new User({
   email,
   password: hashedPassword
 });

 await user.save();

 res.json(user);

});

router.post("/login", async (req,res)=>{

 const {email,password} = req.body;

 const user = await User.findOne({email});

 if(!user){
   return res.status(404).json({message:"User not found"});
 }

 const match = await bcrypt.compare(password,user.password);

 if(match){
   req.session.userId = user._id
   res.json({message:"Login success"})
 }else{
   res.status(401).json({message:"Wrong password"})
 }

});