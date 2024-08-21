const express = require("express");
const router = express.Router();
const {getAllFolders, getFolder, makeFolder, updateFolder, deleteFolder} = require("./folderFunctions");

router.route("/").get(getAllFolders).post(makeFolder);
router.route("/:folderName").get(getFolder).put(updateFolder).delete(deleteFolder);

router.post("/:folderName",(req,res)=>{
    return res.status(201).json({message: `Content created in folder ${req.params.folderName}.`});
});

module.exports = router;