const express = require("express");
const router = express.Router();
const{getContent, makeContent, updateContent, deleteContent}=require("./contentController");

router.route("/").get(getContent).post(makeContent).put(updateContent).delete(deleteContent);

module.exports = router;