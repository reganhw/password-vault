const express = require("express");
const router = express.Router();
const {validId, validToken} = require("../middleware");
const{getManyItems,getItem, makeItem, updateItem, deleteItem}=require("./itemFunctions");

router.route("/").get(validToken, getManyItems).post(validToken, makeItem);
router.route("/:id").get(validId,validToken, getItem).put(validId,validToken, updateItem).delete(validId,validToken, deleteItem);

module.exports = router;