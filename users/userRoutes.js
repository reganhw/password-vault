const express = require("express");
const router = express.Router();
const{makeUser, signInUser, getUser, updateUser, deleteUser}=require("./userFunctions");


router.post("/register",makeUser);

router.post("/signin",signInUser);

router.route("/account/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;