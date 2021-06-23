const express=require("express")
const app =express()
const morgan= require('morgan')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const cookieParser =require('cookie-parser')
require('dotenv/config');
const expressValidator= require('express-validator')
const api=process.env.API_URL
const dburl=process.env.URLdb
const userRoute=require('./routes/user-api')
const authRoute=require('./routes/auth-api')
const categoryRoute=require('./routes/category-api')
const productRoute=require('./routes/product-api')
const braintreeRoute=require('./routes/braintree')
const orderRoute=require('./routes/orders')

const authJwt= require('./helper/jwt')
const cors=require('cors')
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(expressValidator())
app.use(authJwt())
app.use(cors())
app.use(`${api}/users`,userRoute)
app.use(`${api}`,authRoute)
app.use(`${api}/categories`, categoryRoute)
app.use(`${api}/products`,productRoute)
app.use(`${api}/braintree`,braintreeRoute)
app.use(`${api}/order`,orderRoute)
mongoose.connect(dburl,
    { useNewUrlParser: true ,
    useUnifiedTopology: true ,
   dbName:'e-shop'})
   .then(()=> console.log("Database connect scussefully......."))
   .catch((err)=> console.log(err));
    const PORT= process.env.PORT || 8000
   app.listen(PORT,()=>{console.log("Server run know on http://localhost:8000")})