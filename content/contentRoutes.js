const express = require("express");
const router = express.Router();

router.get("/", (req,res)=>{
    // If an ID is specified, get content with that ID. The TYPE parameter has no effect.
    if(req.query.id){
        return res.status(200).json({message:`Get content with ID ${req.query.id}.`});
    }

    // If there is no ID but there is a type.
    if(req.query.type){
        return getType(req.query.type,res);
    }
    // If there is no ID and no type. Note: Didn't consider the case where there's some other parameter.
    return res.status(200).json({message:"Get all content."});
});

const getType =(reqType,res)=>{
    switch (reqType){          
            
        case "logins":
            return res.status(200).json({message:"Get all logins."});
        case "notes":
            return res.status(200).json({message: "Get all notes."});
        default:
            return res.status(401).json({message: "Invalid content type."});
    }

}

router.post("/",(req,res)=>{
    return res.status(201).json({message:"Content successfully created."});
});

router.put("/",(req,res)=>{
    if (!req.query.id){
        return res.status(401).json({message:"Please provide the ID of the content to update."});
    }
    return res.status(200).json({message:`Update content with ID ${req.query.id}.`});
});


router.delete("/",(req,res)=>{
    if (!req.query.id){
        return res.status(401).json({message:"Please provide the ID of the content to delete."});
    }
    return res.status(200).json({message:`Delete content with ID ${req.query.id}.`});
});

module.exports = router;