const express = require("express");
const router = express.Router();
const {validToken} = require("../middleware");
const{getManyItems,getItem, makeItem, updateItem, deleteItem}=require("./itemFunctions");

router.route("/").get(getManyItems).post(validToken, makeItem);
router.route("/:id").get(getItem).put(updateItem).delete(deleteItem);

module.exports = router;