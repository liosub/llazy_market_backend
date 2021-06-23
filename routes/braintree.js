const express= require("express")
const router = express.Router()
const {generateToken,userId,processPayment} = require('../controllers/auth')


router.get(`/getToken/:userId`,generateToken)
router.post(`/payment/:userId`,processPayment)


//router.param("userId",userId)


module.exports =router;