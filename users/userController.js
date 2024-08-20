const makeUser = (req,res)=>{
    console.log("The request body is:" ,req.body);
    const {email, password}=req.body;

    // See if all fields are there.
    if(!email || !password){
        res.status(400);
        throw new Error("All fields are required.");
    }
    
    return res.status(201).json({message:"Registered!"});
}

const loginUser = (req,res)=>{
    const {email, password}=req.body;

    // See if all fields are there.
    if(!email || !password){
        res.status(400);
        throw new Error("All fields are required.");
    }
    return res.status(200).json({message:"User logged in."});
}

const showUser = (req,res) =>{
    return res.status(200).json({message:`User ${req.params.id}.`});
}

const updateUser = (req, res)=>{
    return res.status(200).json({message:`User ${req.params.id} updated.`});
}

const deleteUser =(req, res)=>{
    return res.status(200).json({message:`User ${req.params.id} deleted.`});
}
module.exports={makeUser, loginUser, showUser, updateUser, deleteUser};