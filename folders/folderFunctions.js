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

const updateFolder = asyncHandler(async(req,res)=>{
    const userId = req.payload.id;
    const oldName = req.body.oldName;
    const newName = req.body.newName;
    await User.updateOne({ _id: userId },{ $pull: { folders: oldName}});
    await User.updateOne({ _id: userId },{ $push: { folders: newName}});



    return res.status(200).json({message:`Folder ${newName} updated.`});
});

const deleteFolder = asyncHandler(async(req,res)=>{
    const userId = req.payload.id;
    const folderName=req.params.folderName;
    if(folderName=="default"){
        res.status(400);
        throw new Error("The default folder can't be deleted.");
    }
    
    const {action} = req.body;
    // Ask user whether to delete everything or migrate content.
    if (!action) {
        return res.status(200).json({
            message: "Option for the items in the folder.",
            options: [
                "delete-all",
                "keep-content"
            ]
        });
    }

    // Perform the action based on the user's decision.
    let message;
    switch (action) {
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
    await User.updateOne({_id:userId}, {$pull:{folders:folderName}});
    return res.status(200).json({message: message});
    }
);

const deleteContent = asyncHandler(async(userId,folderName)=>{
    const Items = mongoose.connection.db.collection("items");
    await Items.deleteMany({folder:folderName, userId});

});

const keepContent = asyncHandler(async(userId,folderName)=>{
    const Items = mongoose.connection.db.collection("items");
    await Items.updateMany({folder:folderName, userId}, {$set:{folder:"default"}});

});

module.exports={getAllFolders, getFolderContent, makeFolder, updateFolder, deleteFolder};