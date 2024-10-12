// controllers/customerController.js
const Customer = require('../models/Customer');
const jwt = require('jsonwebtoken');
const { generateOtp, sendOtpSms, storeOtp } = require('../services/twilioServices');

const secretKey = process.env.WhatIsYourName;


const customerRegister = async (req, res) => {
    const { name, phoneNumber, email } = req.body;  // Removed password
    try {
        const customerExists = await Customer.findOne({ $or: [{ email }, { phoneNumber }] });
        if (customerExists) {
            return res.status(409).json({ error: 'Email or Phone Number already exists' });
        }

        const newCustomer = new Customer({
            name,
            phoneNumber,
            email,
            // No password here
        });
        await newCustomer.save();

        res.status(201).json({ message: 'Customer registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Handle login request, send OTP
const customerLogin = async (req, res) => {
    const { phoneNumber } = req.body;
    try {
        const customer = await Customer.findOne({ phoneNumber });
        if (!customer) {
            return res.status(404).json({ error: "Customer not found" });
        }

        // Generate OTP and send via SMS
        const otp = generateOtp();
        await storeOtp(phoneNumber, otp);

        const smsSent = await sendOtpSms(phoneNumber, otp);
        if (!smsSent) {
            return res.status(500).json({ error: "Failed to send OTP" });
        }

        res.status(200).json({ message: "OTP sent to your phone" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Verify OTP
const verifyOtp = async (req, res) => {
    const { phoneNumber, otp } = req.body;
    try {
        const customer = await Customer.findOne({ phoneNumber });
        if (!customer) {
            return res.status(404).json({ error: "Customer not found" });
        }

        // Check if OTP is correct and not expired
        if (customer.otp !== otp || new Date() > customer.otpExpiration) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }

        // Generate JWT token after OTP is verified
        const token = jwt.sign({ customerId: customer._id }, secretKey, { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    customerLogin,
    verifyOtp,
    customerRegister,
};
