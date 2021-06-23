const e = require("express");
const express= require("express")
const router = express.Router()
const { Category } = require("../models/category-db")
const { errorHandler } = require("../helper/dbmessagerror")

router.get(`/`,async(req,res)=>{
    const category= await Category.find();
    if(!category){
        res.status(500).json({success:false,message:"no categories"})
    }
    res.status(200).send(category)
})

router.get(`/:id`, async(req,res)=>{
    const categoryItem= await Category.findById(req.params.id);
    if(!categoryItem){
        res.status(500).json({success:false,message:"no category with this id"})
    }
    res.send(categoryItem);
})

router.post(`/create`,async(req,res)=>{
    
    let category= new Category({
        name:req.body.name
    })
    category= await category.save((error,data)=>{
        if(error){
            return res.status(400).json({
                error:errorHandler(error)
            });
        }
        res.json({data});
    })
})

router.put(`/:id`,async(req,res)=>{
    const category=await Category.findByIdAndUpdate(
        req.params.id,
        {
            name:req.body.name,
        },{new : true}
        )
        if(!category){
            return res.status(401).json({success:false, message:"can not update this category item some thing wrong"})
        }
        res.send(category)
})

router.delete(`/:id`, (req,res)=>{
    Category.findByIdAndRemove(req.params.id)
    .then((category)=>{
        if(category){
            return res.status(200).json({success:true, message:'The category was deleted successfully'})
        }
        else{
            return res.status(400).json({success:false,message:'category not found!!'})
        }
    })
    .catch((err)=>{
        return res.status(401).json({success:false,error:err});
    })
})





module.exports=router;
