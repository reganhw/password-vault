const express = require("express");
const router = express.Router();
const {validToken} = require("../middleware");
const{makeUser, signInUser, getUser, updateUser, deleteUser}=require("./userFunctions");


router.post("/register",makeUser);

router.post("/signin",signInUser);

router.route("/account").get(validToken, getUser).put(validToken,updateUser).delete(validToken, deleteUser);

module.exports = router;