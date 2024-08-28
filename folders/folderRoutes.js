const express = require("express");
const router = express.Router();
const {validToken} = require("../middleware");
const {getAllFolders, getFolderContent, makeFolder, updateFolder, deleteFolder} = require("./folderFunctions");

router.route("/").get(validToken, getAllFolders).post(validToken, makeFolder).put(validToken,updateFolder);
router.route("/:folderName").get(validToken, getFolderContent)
.delete(validToken, deleteFolder);


module.exports = router;