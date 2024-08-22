const express = require("express");
const router = express.Router();
const {validToken} = require("../middleware");
const{getManyItems,getItem, makeItem, updateItem, deleteItem}=require("./itemFunctions");

router.route("/").get(validToken, getManyItems).post(validToken, makeItem);
router.route("/:id").get(validToken, getItem).put(validToken, updateItem).delete(validToken, deleteItem);

module.exports = router;