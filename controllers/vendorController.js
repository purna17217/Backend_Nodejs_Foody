const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotEnv = require('dotenv');
const mongoose = require('mongoose'); // Import mongoose

dotEnv.config();

const secretkey = process.env.WhatIsYourName

const vendorRegister = async(req,res)=>{
    const {username, email, password} = req.body;
    try{
        const vendorEmail = await Vendor.findOne({email});
        if(vendorEmail){
            return res.status(400).json("Email already taken")
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newVendor = new Vendor({
            username,
            email,
            password:hashedPassword
        });
        await newVendor.save();
        res.status(201).json({message:"Vendor registered successfully"});
        console.log("Registered");
    }
    catch(error){
        console.log(error);
        res.status(500).json({error:"Internal server error"});
        
    }
}

const vendorLogin = async(req,res)=>{
    const {email, password} = req.body;
    console.log("Received Email:", email); // Log the received values
    console.log("Received Password:", password);
    try{
        const vendor = await Vendor.findOne({email});
        if(!vendor || !(await bcrypt.compare(password, vendor.password))){
            return res.status(401).json({error:"Invalid Username or Password"})
        }

        const token = jwt.sign({vendorId: vendor._id}, secretkey, {expiresIn: "1h"})

        const vendorId = vendor._id;
        res.status(200).json({message: "Login Successfully", token, vendorId})
        console.log(email, "This is token", token);
    }catch(error){
        console.log(error);
        res.status(500).json({error: "Internal server Error"})
    }
}

const getAllVendors = async(req, res)=>{
    try{
        const vendors = await Vendor.find().populate('firm')
        res.json({vendors})
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({error: "Internal server Error"})
    }
}

const getVendorById = async(req, res)=>{
    const vendorId = req.params.vendorId;
    console.log(vendorId);
    if (!mongoose.isValidObjectId(vendorId)) {
        return res.status(400).json({ message: "Invalid Vendor ID" });
    }
    try{
        const vendor = await Vendor.findById(vendorId).populate('firm');
        if(!vendor)
        {
            console.log(vendor);
            return res.status(404).json({message: "Vendor not Found"})
        }
        // const vendorFirmId = vendor.firm[0]._id;
        // res.status(200).json({vendorId, vendorFirmId, vendor})
        // console.log(vendorFirmId);
        let vendorFirmId;
        if (vendor.firm && vendor.firm.length > 0) {
            vendorFirmId = vendor.firm[0]._id; // Safely access _id
        } else {
            vendorFirmId = null; // or handle as appropriate
        }

        res.status(200).json({ vendorId, vendorFirmId, vendor });
        console.log(vendorFirmId);

    
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({error: "Internal server Error"})
    }
}

module.exports = {vendorRegister, vendorLogin, getAllVendors, getVendorById}