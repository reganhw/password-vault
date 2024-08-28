const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const User = require("../users/userSchema");
const validType = require("../items/itemFunctions");

//@desc Display all folders a user owns
//@route GET /api/folders
//@access private

const getAllFolders =asyncHandler(async(req,res)=>{
    
    const userId = req.payload.id;                // current user's id
    const user = await User.findById(userId);     // get user document
    return res.status(200).json(user.folders);    // display the folders field
}
);

//@desc Display all items in a folder
//@route GET /api/folders/:folderName or GET /api/folders/:folderName?type=[type]
//@access private

const getFolderContent = asyncHandler (async(req,res)=>{
    const userId = req.payload.id;
    const folderName = req.params.folderName;
    const type = req.query.type;
    const Items = mongoose.connection.db.collection("items");

    let content;
    if(type){
        // Check the type is valid, get all items in the folder of that type.
        validType(type, res); 
        content = await Items.find({folder:folderName, userId, type}).sort({"title":1}).toArray();
        
    }else{
        // Get all items in the folderName.
        content = await Items.find({folder:folderName,userId}).sort({"title":1}).toArray();
    }
   
    return res.status(200).json(content);

}
);
//@desc Make a folder.
//@route POST /api/folders/
//@access private

const makeFolder = asyncHandler(async (req,res)=>{
    const userId = req.payload.id;
    const folderName = req.body.folderName;
    const user = await User.findById(userId);
    const folders = user.folders;

    // Check if the user already has that folder.
    if (folders.includes(folderName)){
        res.status(400);
        throw new Error(`Folder ${folderName} already exists.`);
    }
    
    // Append folderName to user.folders.
    await User.updateOne({ _id: userId },{ $push: { folders: folderName} });
    
    return res.status(201).json({message:`Folder ${folderName} successfully created.`});
});

//@desc Change a folder's name.
//@route PUT /api/folders
//@access private

const updateFolder = asyncHandler(async(req,res)=>{
    const userId = req.payload.id;
    const oldName = req.body.oldName;
    const newName = req.body.newName;

    // Delete old folder from users.folder and append new folder.
    await User.updateOne({ _id: userId },{ $pull: { folders: oldName}}); 
    await User.updateOne({ _id: userId },{ $push: { folders: newName}}); 

    // Update the folder field of all items associated with old folder.
    const Items = mongoose.connection.db.collection("items");
    await Items.updateMany({folder:oldName, userId:userId}, {$set:{folder:newName}});


    return res.status(200).json({message:`Folder ${newName} updated.`});
});

//@desc Delete a folder.
//@route DELETE /api/folders
//@access private

const deleteFolder = asyncHandler(async(req,res)=>{
    const userId = req.payload.id;
    const folderName=req.params.folderName;

    // Prevent default folder from being deleted.
    if(folderName=="default"){
        res.status(400);
        throw new Error("The default folder can't be deleted.");
    }
    
    const {option} = req.body;
    // Ask user whether to delete everything or migrate content.
    if (!option) {
        return res.status(200).json({
            message: "Option for the items in the folder.",
            options: [
                "delete-all",
                "keep-content"
            ]
        });
    }

    // Perform the action based on option given.
    let message;
    switch (option) {
        case "delete-all":
            deleteContent(userId, folderName);
            message= `Folder ${folderName} and all its contents were deleted.`;
            break;
        case "keep-content":
            keepContent(userId, folderName);
            message= `Folder ${folderName} was deleted and its contents were migrated to \"default \".`;
            break;
        default:
            res.status(400);
            throw new Error("Invalid action specified.");
    }
    // Delete folderName from users.folders.
    await User.updateOne({_id:userId}, {$pull:{folders:folderName}});
    return res.status(200).json({message: message});
  }
);

// Helper function for deleteFolder, deletes all items.
const deleteContent = asyncHandler(async(userId,folderName)=>{
    const Items = mongoose.connection.db.collection("items");
    await Items.deleteMany({folder:folderName, userId});

});

// Helper function for deleteFolder, migrates all items to default folder.
const keepContent = asyncHandler(async(userId,folderName)=>{
    const Items = mongoose.connection.db.collection("items");
    await Items.updateMany({folder:folderName, userId}, {$set:{folder:"default"}});

});

module.exports={getAllFolders, getFolderContent, makeFolder, updateFolder, deleteFolder};