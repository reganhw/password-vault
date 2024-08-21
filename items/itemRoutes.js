const express = require("express");
const router = express.Router();
const{getItem, makeItem, updateItem, deleteItem}=require("./itemFunctions");

router.route("/").get(getItem).post(makeItem).put(updateItem).delete(deleteItem);

module.exports = router;