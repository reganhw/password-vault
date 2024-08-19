const express = require("express");
const router = express.Router();
const {getAllFolders, getFolder, makeFolder, updateFolder, deleteFolder} = require("./folderController");

router.get("/",getAllFolders);

router.post("/",makeFolder);

router.get("/:folderName", getFolder);

router.post("/:folderName",(req,res)=>{
    return res.status(201).json({message: `Content created in folder ${req.params.folderName}.`});
});

router.put("/:folderName", updateFolder);

router.delete("/:folderName", deleteFolder);


module.exports = router;