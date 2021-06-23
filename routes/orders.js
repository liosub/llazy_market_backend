const express= require("express")
const router = express.Router()
const {Order,CartItem} =require('../models/order-db')
const {create,userId,processPayment} = require('../controllers/auth')
const { errorHandler } = require("../helper/dbmessagerror")


router.post(`/create_order/:id`,create)
//router.param("userId",userId)

router.get(`/listAll`,async(req,res)=>{
 await Order.find().populate('user',"_id name address")
    .sort('-created')
    .exec((err,orders) =>{
        if(err){
            return  res.status(400).json({
                error:"could not get orders"
            })
        }
        res.json(orders)
    })
})




router.get(`/status_value`,async(req,res)=>{
    res.json(Order.schema.path('status').enumValues)

})

router.put(`/:id/status`,async(req,res) =>{
    order_id = await Order.findById(req.params.id).populate('products.product','name price');
    console.log(req.body.status,req.params.id)
    await Order.update(
        {_id: req.params.id},
        {$set: {status: req.body.status}},
        (err,order) =>{
            if(err){
                return res.status(400).json({
                    error:errorHandler(err)
                })
            }
            res.json(order)
        }
    )

})


module.exports =router;


