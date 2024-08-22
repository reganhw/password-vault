const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const User = require("../users/userSchema");
const {getItem, validType} = require("../items/itemFunctions");

//GET CASES:
//  ("api/folders"): Retrieve all folders.
//  ("api/folders/myFolder"): Retrieve contents of myFolder.
//  ("api/folders/myFolder&type=note"): Retrieve all notes in myFolder.

const getAllFolders =asyncHandler(async(req,res)=>{
    // User validation.
    const userId = req.payload.id;
    const user = await User.findById(userId);
    return res.status(200).json(user.folders);
}
);

const getFolderContent = asyncHandler (async(req,res)=>{
    const userId = req.payload.id;

    const folderName = req.params.folderName;
    
    const type = req.query.type;

    const Items = mongoose.connection.db.collection("items");
    let content;
    if(type){
        validType(type, res);
        content = await Items.find({folder:folderName, userId, type}).sort({"title":1}).toArray();
        
    }else{
        content = await Items.find({folder:folderName,userId}).sort({"title":1}).toArray();
    }
   
    return res.status(200).json(content);

}
);

const makeFolder = asyncHandler(async (req,res)=>{
    const userId = req.payload.id;
    const folderName = req.body.folderName;

    const user = await User.findById(userId);
    const folders = user.folders;
    if (folders.includes(folderName)){
        res.status(400);
        throw new Error(`Folder ${folderName} already exists.`);
    }
    
    await User.updateOne({ _id: userId },{ $push: { folders: folderName} });
        
    return res.status(201).json({message:`Folder ${folderName} successfully created.`});
});

const updateFolder = (req,res)=>{
    return res.status(200).json({message:`Folder ${req.params.folderName} updated.`});
}

const deleteFolder = (req,res)=>{
    const folderName=req.params.folderName;

    const {action} = req.body;
    // Ask user whether to delete everything or migrate content.
    if (!action) {
        return res.status(200).json({
            message: "Are you sure you want to delete this folder?",
            options: [
                "Delete folder and all its contents.",
                "Delete folder and migrate contents elsewhere."
            ]
        });
    }

    // Perform the action based on the user's decision.
    switch (action) {
        case "delete-all":
            return res.status(200).json({ message: `Folder ${folderName} and its contents have been deleted.`});
        case "preserve-content":
            return res.status(200).json({message: `Folder ${folderName} was deleted and its contents were migrated.`});
        default:
            res.status(400);
            throw new Error("Invalid action specified.");
    }
}

module.exports={getAllFolders, getFolderContent, makeFolder, updateFolder, deleteFolder};