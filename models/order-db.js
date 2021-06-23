const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const CartItemSchema= new mongoose.Schema(
    {
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
       },
       name:String,
        price:Number,
        count:Number
    },
    {timestamps:true}
);
const CartItem=mongoose.model("CartItem",CartItemSchema);


const OrderSchema= new mongoose.Schema(
   {
    products:[CartItemSchema],
    transaction_id:{},
    amount:{type:Number},
    address:String,
    status:{
        type:String,
        default:"Not processed",
        enum:["Not processed", "Processing","Shipped","Delivered","Cancelled"]
    },
    update:Date,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    },
    {timestamps:true}
);
const Order=mongoose.model("Order",OrderSchema);

module.exports ={Order,CartItem}