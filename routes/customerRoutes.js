const customerController = require('../controllers/customerController');
const express = require('express');

const router = express.Router();

router.post('/signin', customerController.customerRegister);
router.post('/login', customerController.customerLogin);
router.post('/verify-otp', customerController.verifyOtp);
module.exports = router;
