const {getContent, validType} = require("../content/contentController");

//GET CASES:
//  ("api/folders"): Retrieve all folders.
//  ("api/folders/myFolder"): Retrieve contents of myFolder.
//  ("api/folders/myFolder&type=note"): Retrieve all notes in myFolder.
//  ("api/folders/myFolder&id=myID"): Retrieve content with that ID.
const getAllFolders =(req,res)=>{
    return res.status(200).json({message:"All folders."});
}

const getFolder = (req,res)=>{
    const folderName = req.params.folderName;
    const id = req.query.id;
    const type = req.query.type;

    if (!id && !type){
        return res.status(200).json({message:`GET ${folderName}.`});
    }

    if(id){
        return getContent(req,res);
    }

    if(type){
        validType(type, res);
        return res.status(200).json({message: `GET contents of type ${type} in ${folderName}.`});
    }

}

const makeFolder = (req,res)=>{
    return res.status(201).json({message:"Folder successfully created."});
}

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
            return res.status(200).json({
                 message: `Folder ${folderName} was deleted and its contents were migrated.` 
                });
        default:
            res.status(400);
            throw new Error("Invalid action specified.");
    }
}

module.exports={getAllFolders, getFolder, makeFolder, updateFolder, deleteFolder};