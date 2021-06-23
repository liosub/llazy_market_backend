const {User}= require('../models/user-db')
const {Product} =require('../models/product-db')
const {Order,CartItem} =require('../models/order-db')
const braintree =require('braintree')
const { errorHandler } = require("../helper/dbmessagerror")

require('dotenv').config()


const gateway= new braintree.BraintreeGateway({
            environment:braintree.Environment.Sandbox,
            merchantId:process.env.BRAINTREE_MERCHENT_ID,
            publicKey:process.env.BRAINTREE_PUBLIC_KEY,
            privateKey:process.env.BRAINTREE_PRIVATE_KEY
})

exports.generateToken =(req,res) =>{
gateway.clientToken.generate({},function(err,response){
    if(err){
        res.status(500).send(err)
    }
    else{
        res.send(response)
    }
})
}

exports.userId =async(req,res,next,id) =>{
    await User.findById(id).exec((err,user) =>{
        if(err || !user){
            return res.status(400).json({
                error:"user not found"
            })
        }
        req.profile =user;
        console.log(req.profile)
        next();
    })
}

exports.processPayment =(req,res) =>{
    let nonceFromTheClient =req.body.paymentMethodNonce
    let amountFromTheClient = req.body.amount
    let newTransaction = gateway.transaction.sale({
        amount: amountFromTheClient,
        paymentMethodNonce: nonceFromTheClient,
        options:{
            submitForSettlement:true
        }
    },(error,result)=>{
        if(error){
            res.status(500).json(error)
        }else{
            res.json(result)
        }
    })
}

exports.create=async(req,res)=>{
   const user= await User.findById(req.params.id);

    req.body.order.user= user
  // console.log(req.body.order)
    const order = await new Order(req.body.order)
   await order.save((error,data) =>{
         if(error){
             return res.status(400).json({
                 error:errorHandler(error)
             })
         }
         res.json(data)
     })


     let history = []
     req.body.order.products.forEach((item) =>{
         history.push({
             _id:item._id,
             name:item.name,
             description:item.description,
             category:item.category,
             quantity:item.count,
             transaction_id:req.body.order.transaction_id,
             amount:req.body.order.amount
         })
     })
   await  User.findOneAndUpdate({_id:req.params.id},{$push:{history:history}}, {new:true},
         (error,data)=>{
             if(error){ 
                 return  res.status(400).json({
                     error:"could not update user purchase history"
                 })
             }
         })

    let bulkOps =req.body.order.products(map(item =>{
        return {
            updateOne:{
                filter:{_id:item.id},
                update:{$inc:{quantity: -item.count,sold:+item.count}}
            }
        }
    }))
       await Product.bulkWrite(bulkOps,{},(error,products)=>{
            if(error){
                return res.status(400);
            }
            else{res.send(products)}
        }
        )


    }

