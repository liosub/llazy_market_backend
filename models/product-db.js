const mongoose= require('mongoose');
const Schema=mongoose.Schema;

const productSchema= Schema({
    name:{
        type:String,
        trim:true,
        required:true,
        maxlength:32
    },
     description:{
        type:String,
        required:true,
        maxlength:2000
    },
    price:{
        type:Number,
        trim:true,
        required:true,
        maxlength:32
        },
    category:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Category',
            required:true    
        },
        quantity:{
            type:Number,
        },
        sold:{
            type:Number,
            default:0
        },
        photo:{
            data:Buffer,
            contentType:String
        },
        shipping:{
            required:false,
            type:Boolean
        }
            
    
},{timestamps:true})

exports.Product = mongoose.model('Product', productSchema);
