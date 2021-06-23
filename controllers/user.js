
const express=require('express');
const router = express.Router();
const {User} =require('../models/user-db')
const expressJwt= require("express-jwt")
const {errorHandler} =require('../helper/dbmessagerror')
require('dotenv/config');
const jwt = require('jsonwebtoken');


exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'auth'
});

exports.isAuth = async(req, res, next) => {
    let user = await req.profile && req.auth && req.profile._id == req.auth._id;
    console.log(req.auth,req.profile )
    if (!user) {
        return res.status(403).json({
            error: 'Access denied'
        });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: 'Admin resourse! Access denied'
        });
    }
    next();
};