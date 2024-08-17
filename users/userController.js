const makeUser = (req,res)=>{
    res.status(201).json({message:"Registered!"});
}

const loginUser = (req,res)=>{
    res.status(200).json({message:"User logged in."});
}

const showUser = (req,res) =>{
    res.status(200).json({message:`User ${req.params.id}.`});
}

const updateUser = (req, res)=>{
    res.status(200).json({message:`User ${req.params.id} updated.`});
}

const deleteUser =(req, res)=>{
    res.status(200).json({message:`User ${req.params.id} deleted.`});
}
module.exports={makeUser, loginUser, showUser, updateUser, deleteUser};