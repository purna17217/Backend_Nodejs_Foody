const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv');

dotEnv.config();

const secretkey = process.env.WhatIsYourName
const verfiyToken = async(req, res, next)=>{

    const token = req.headers.token;

    if(!token)
    {
        return res.status(401).json({error: "Token is required"});
    }
    try{
        const decoded = jwt.verify(token, secretkey)
        const vendor = await Vendor.findById(decoded.vendorId)
        if(!vendor){
            res.status(404).json({message:"Vendor not Found"})
        }
        req.vendorId = vendor._id
        next()
    }
    catch(error){
        console.log(error);
        return res.status(500).json({error: "Invalid Token"})

    }

}

module.exports=verfiyToken