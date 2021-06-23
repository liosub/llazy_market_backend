const mongoose= require('mongoose');
const Schema=mongoose.Schema;
const crypto =require('crypto');
const uuidv1=require('uuidv1')
const userSchema= Schema({
    name:{
        type:String,
        trim:true,
        required:true,
        maxlength:32
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:32
    },
    hashed_password:{
        type:String,
        required:true,
    },
    about:{
        type:String,
        trim:true,
    },
    salt:{
        type:String,
    
    },
    isAdmin:{
        type:Boolean,
        default:false,
    },
    history:{
        type:Array,
        default:[]
    },
},{timestamps:true})
userSchema.virtual('password')
.set(function(password){
    this._password=password
    this.salt=uuidv1()
    this.hashed_password=this.encryptPassword(password)
})
.get(function(){
    return this._password
})

userSchema.methods={
    authenticate: function(plainText){
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    encryptPassword:function(password){
        if(!password) return '';
        try{
            return crypto.createHmac('sha1', this.salt)
            .update(password)
            .digest("hex");
        }
        catch(err) {console.log(err)};
    }
}

exports.User = mongoose.model('User', userSchema);
