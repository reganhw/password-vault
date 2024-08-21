const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./userSchema");  

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
            payload:
                {
                    username:user.username,
                    email: user.email,
                    id:user.id,
                },
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

const getUser = asyncHandler(async(req,res) =>{
    const id = req.params.id;

    // Check that the user exists.
    const user = await User.findById(id);
    if (!user){
        res.status(404);
        throw new Error("User doesn't exist.");
    }

    // Return user info.
    return res.status(200).json({_id: user.id, email: user.email});
});

const updateUser = asyncHandler(async(req, res)=>{
    const id = req.params.id;
    await User.findByIdAndUpdate(id,req.body);
    const updatedUser = await User.findById(id);
    return res.status(200).json(updatedUser);
});

const deleteUser =asyncHandler(async(req, res)=>{
    const id = req.params.id;

    // Check that the user exists.
    const user = await User.findById(id);
    if (!user){
        res.status(404);
        throw new Error("User doesn't exist.");
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({message:`User ${id} deleted.`});
});
module.exports={makeUser, signInUser, getUser, updateUser, deleteUser};