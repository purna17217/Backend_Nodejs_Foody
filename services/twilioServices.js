// services/twilioService.js
const twilio = require('twilio');
const otpGenerator = require('otp-generator');
const Customer = require('../models/Customer');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

// Generate OTP
const generateOtp = () => {
    return otpGenerator.generate(3, { digits: true, alphabets: false, upperCase: false, specialChars: true });
};

// Send OTP via Twilio SMS
const sendOtpSms = async (phoneNumber, otp) => {
    try {
        const message = await client.messages.create({
            body: `Your OTP code is ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber,
        });
        console.log('OTP sent via SMS: ', message.sid);
        return true;
    } catch (error) {
        console.error('Error sending OTP via SMS:', error);
        return false;
    }
};

// Store OTP and expiration in the database
const storeOtp = async (phoneNumber, otp) => {
    const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
    const customer = await Customer.findOne({ phoneNumber });

    if (customer) {
        customer.otp = otp;
        customer.otpExpiration = otpExpiration;
        await customer.save();
    } else {
        throw new Error('Customer not found');
    }
};

module.exports = {
    generateOtp,
    sendOtpSms,
    storeOtp,
};
