const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./userSchema");

//@desc Register a user
//@route POST /api/users/register
//@access public

const makeUser = asyncHandler(async(req,res)=>{

    // Ensure both fields are present.
    const {email, password}=req.body; 
    if (!email || !password){
        res.status(400);
        throw new Error("Both fields are required.");
    }
    
    // Check for duplicate email address.
    const emailTaken = await User.findOne({ email }).exec();
    if(emailTaken){
        res.status(400);
        throw new Error("Email already registered.");
    }

    // Create user.
    const hashedPassword = await bcrypt.hash(password,10);
    const user = await User.create({
        email,
        password:hashedPassword,
    });

    // Return created user.
    return res.status(201).json(
        {_id:user.id,
            email: user.email,
            password: user.password
        });
      
    
});

//@desc Sign a user in
//@route POST /api/users/login
//@access public

const signInUser = asyncHandler(async(req,res)=>{
    const {email, password}=req.body;

    // See if all fields are there.
    if(!email || !password){
        res.status(400);
        throw new Error("Both fields are required.");
    }

    const user = await User.findOne({email});
    if(user && (await bcrypt.compare(password,user.password))){
        const accessToken = jwt.sign(
            {
               payload:{ id:user.id, email:user.email},
            },
            process.env.TOKEN,
            {expiresIn: "60m"}
        );
        res.status(200).json({accessToken});
    }else{
        res.status(401);
        throw new Error("Email and password do not match.");
    }
});

//@desc Get a user's description
//@route GET /api/users/account
//@access private

const getUser = asyncHandler(async(req,res) =>{
    return res.status(200).json(req.payload);
});

//@desc Update a user's description DO SOMETHING ABOUT PASSWORD.
//@route PUT /api/users/account
//@access private

const updateUser = asyncHandler(async(req, res)=>{
    const id = req.payload.id;
    await User.findByIdAndUpdate(id,req.body);
    const updatedUser = await User.findById(id);
    return res.status(200).json(updatedUser);
});

//@desc Delete account.
//@route DELETE /api/users/account
//@access private
const deleteUser =asyncHandler(async(req, res)=>{
    const id = req.payload.id;

    await User.findByIdAndDelete(id);

    return res.status(200).json({message:"Account deleted."});
});
module.exports={makeUser, signInUser, getUser, updateUser, deleteUser};