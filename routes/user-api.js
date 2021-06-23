const express= require("express")
const router = express.Router()
const { User } = require("../models/user-db")



router.get(`/admin/:id`,async(req,res)=>{

    const user= await User.findById(req.params.id).select("-hashed_password");
    if(!user){
        res.status(500).json({message:'there is no user for this id'})
    }
    res.status(200).send(user);

})



router.get(`/:id`,async(req,res)=>{

    const user= await User.findById(req.params.id)
    .select("-hashed_password")
    .select("-salt");
    if(!user){
        res.status(500).json({message:'there is no user for this id'})
    }
    res.status(200).send(user);

})

router.put(`/:id`,(req,res)=>{
    User.findByIdAndUpdate(
        req.params.id,
        {
            $set: req.body
        },
        {new: true},
        (err,user)=>{
            if(err){
                return res.status(400).json({
                    error:'You are not authorized to perform this action'
                })
            }
            user.hashed_password=undefined
            user.salt=undefined
            res.json(user)
        }
        )
})



module.exports=router;
