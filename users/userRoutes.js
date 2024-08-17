const express = require("express");
const router = express.Router();
const{makeUser, loginUser, showUser, updateUser, deleteUser}=require("./userController");


router.post("/register",makeUser);

router.post("/login",loginUser);


router.get("/account/:id",showUser);

router.put("/account/:id", updateUser);

router.delete("/account/:id", deleteUser);
module.exports = router;