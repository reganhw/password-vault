const express = require("express");
const router = express.Router();
const{getManyItems,getItem, makeItem, updateItem, deleteItem}=require("./itemFunctions");

router.route("/").get(getManyItems).post(makeItem);
router.route("/:id").get(getItem).put(updateItem).delete(deleteItem);

module.exports = router;