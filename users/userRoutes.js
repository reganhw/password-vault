const express = require("express");
const router = express.Router();


router.post("/register", (req,res)=>{
    res.status(201).json({message:"Registered!"});
});

router.post("/login",(req,res)=>{
    res.status(200).json({message:"User logged in."});
})

router.get("/:id", (req,res) =>{
    res.status(200).json({message:`User ${req.params.id}.`});
})

router.put("/:id", (req, res)=>{
    res.status(200).json({message:`User ${req.params.id} updated.`});
})

router.delete("/:id", (req, res)=>{
    res.status(200).json({message:`User ${req.params.id} deleted.`});
})
module.exports = router;