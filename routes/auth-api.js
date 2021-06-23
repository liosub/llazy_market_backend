const express=require('express');
const router = express.Router();
const {User} =require('../models/user-db')
const jwt= require("jsonwebtoken")
const authJwt= require('../helper/jwt')
const {errorHandler} =require('../helper/dbmessagerror')
require('dotenv/config');

router.get(`/users`, async(req,res)=>{
    const users=await User.find();
    if(!users){
        res.status(500).json({sucess:false});
    }    
    res.send(users)

})
const {userSignupValidator} = require('../validator'); 
const { use } = require('./user-api');

router.post(`/signup`,userSignupValidator,async(req,res)=>{
    let user=new User({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    })
    user= await user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                err: errorHandler(err)
            });
        }
        res.json({
            user
        });
    })
})
/*
router.post(`/signin`,async(req,res)=> {
  await   User.findOne({email: req.body.email},(err,user)=>{
        const password=req.body.password;

        if(err || !user){
            return res.status(400).json({sucess:false,err:"there is no  user with these email!"})
        }
        if(!user.authenticate(password)){
            return res.status(401).json({sucess:false, error:'Email and Password dont match'})
        }
        const token = jwt.sign({_id:user._id,isAdmin:user.role} , process.env.JWT_SECRET)
        res.cookie('t', token,{expiresIn:'1d'})
        const {_id,name, email, role}=user
        return res.json({token,user:{_id,email,name,role}})
    })

})
*/

router.post(`/signin`,async(req,res)=> {
 const {email,password} =req.body;
 await User.findOne({email},(err,user)=>{
     if(err || !user){
         return res.status(400).json({
             error:"User with that email doesnt exist. Please try again"
         });
     }
     if(!user.authenticate(password)){
         return res.status(401).json({
             error:"Email and Password dont match"
         });
     }
     const {_id,name, email, isAdmin}=user;
     const token = jwt.sign({_id:user._id,isAdmin:user.isAdmin} , process.env.JWT_SECRET)
     res.cookie('t', token,{expiresIn:'1d'})
     return res.json({token,user:{_id,email,name,isAdmin}});
  
 })
})



router.get(`/signout`,async(req,res)=>{
    res.clearCookie("t");
    res.json({message:"Signout success"});
})



module.exports=router;
