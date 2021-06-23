const express= require("express")
const router = express.Router()
const { Product } = require("../models/product-db")
const formidable= require('formidable')
const _= require('lodash')
const fs= require('fs')
const mongoose= require('mongoose');
const { errorHandler } = require("../helper/dbmessagerror")
router.get(`/`,async(req,res)=>{
 let order= req.query.order ? req.query.order :'asc'
 let sortBy= req.query.sortBy ? req.query.sortBy : '_id'
 let limit= req.query.limit ? parseInt(req.query.limit) : 6
 Product.find()
    .select('-photo')
    .populate('category')
    .sort([[sortBy,order]])
    .limit(limit)
    .exec((err,products) =>{
        if(err){
            return res.status(400).json({
                error:"Prodcuts not found"
            })
        }
        res.send(products)
    })

})

router.get(`/:id`, async(req,res)=>{
    const productItem= await Product.findById(req.params.id).populate('category').select('-photo');
    if(!productItem){
        res.status(500).json({success:false,message:"no productItem with this id"})
    }
    res.send(productItem);
})




/*searcg*/
router.post(`/search`,async(req,res)=>{
    let order= req.body.order ? req.body.order :'desc'
    let sortBy= req.body.sortBy ? req.body.sortBy : '_id'
    let limit= req.body.limit ? parseInt(req.body.limit) : 100
    let skip= parseInt(req.body.skip);
    let findArgs={}

    for(let key in req.body.filters){
        if(req.body.filters[key].length >0){
            if(key === "price"){
                findArgs[key]={
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            }
            else{
                findArgs[key]=req.body.filters[key];
            }
        }
    }
   Product.find(findArgs)
    .select("-photo")
    .populate("category")
    .sort([[sortBy,order]])
    .skip(skip)
    .limit(limit)
    .exec((err,data)=>{
        if(err) return res.status(400).send(err);
        res.json({
            size: data.length,
            data
        })
    })
   })
   

/*get product image */

router.get(`/photo/:id`,async(req,res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send('Invalid product Id')
    }
    let product=await Product.findById(req.params.id);
    if(product.photo.data){
        res.set("Content-Type",product.photo.contentType);
        return res.send(product.photo.data);
    }
    
})





/* based on categry app return products smialir */
router.get(`/related/:id`, async(req,res)=>{
   const ne_product= await Product.findById(req.params.id)
    let limit= req.query.limit ? parseInt(req.query.limit) : 6
    await Product.find({_id:{$ne:ne_product} , category:ne_product.category})
    .select('-photo')
    .limit(limit)
    .populate('category','_id name')
    .exec((err,products) =>{
        if(err){
            return res.status(400).json({
                error:"Prodcuts not found"
            })
        }
        res.send(products)
    })

})

 

router.post(`/create`,async(req,res)=>{
    let form = new formidable.IncomingForm()
    form.keepExtensions= true
    form.parse(req,(err,fields,files)=>{
        if(err){
            return res.status(400).json({
                error:'Image could not be upload'
            })
        }
        const {name , description,  price , category, quantity, shipping} =fields
        if(!name || !description || !price || !category || !quantity || !shipping){
            return res.status(400).json({
                error:"Make sure you are input all fields"
            })
        
        }
        let product= new Product(fields)

        if(files.photo){
            if(files.photo.size > 100000){
                return res.status(400).json({
                    error:"Image could not be upload because it's more than 1MB"
                })
            }
            product.photo.data= fs.readFileSync(files.photo.path)
            product.photo.contentType= files.photo.type
        }
        product.save((err,result) =>{
            if(err){
                return res.status(400).json({
                    error:errorHandler(err)
                })
            }
            res.json(result)
        })
    })

})


router.delete(`/:id`, (req,res)=>{
    Product.findByIdAndRemove(req.params.id)
    .then((product)=>{
        if(product){
            return res.status(200).json({success:true, message:'The product was deleted successfully'})
        }
        else{
            return res.status(400).json({success:false,message:'Product not found!!'})
        }
    })
    .catch((err)=>{
        return res.status(401).json({success:false,error:err});
    })
})



router.put(`/:id`,async(req,res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send('Invalid product Id')
    }
    const productU= await Product.findById(req.params.id)
    let form = new formidable.IncomingForm()
    form.keepExtensions= true
    form.parse(req,(err,fields,files)=>{
        if(err){
            return res.status(400).json({
                error:'Image could not be upload'
            })
        }
        const {name , description,  price , category, quantity, shipping} =fields
        if(!name || !description || !price || !category || !quantity || !shipping){
            return res.status(400).json({
                error:"Make sure you are input all fields"
            })
        
        }
        let product= productU;
        product=_.extend(product,fields)

        if(files.photo){
            if(files.photo.size > 100000){
                return res.status(400).json({
                    error:"Image could not be upload because it's more than 1MB"
                })
            }
            product.photo.data= fs.readFileSync(files.photo.path)
            product.photo.contentType= files.photo.type
        }
        product.save((err,result) =>{
            if(err){
                return res.status(400).json({
                    error:errorHandler(err)
                })
            }
            res.json(result)
        })
    })

})

router.get(`/search`,(req,res)=>{
    const query={}
    if(req.query.search){
        query.name={$regex: req.query.search, $options:'i'}
        if(req.query.category && req.query.category != 'All'){
            query.category = req.query.category
        }
        Product.find(query, (err, products) =>{
            if(err){
                return res.status(400).json({
                    error:errorHandler(err)
                })

            }
            res.json(products)
        }).select('-photo ')
    }
})



module.exports=router;
