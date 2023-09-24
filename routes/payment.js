// express
const express = require('express');

// create router from express
const router = express.Router();

// controller
const paymentController = require('../controllers/paymentController');

// middleware for user login
const {isLoggedIn} = require('../middlewares/user');


// define route with controller

// get stripe public key
router.route('/stripeKey').get(isLoggedIn, paymentController.stripeKey);
// getting razorpay public key
router.route('/razorpayKey').get(isLoggedIn, paymentController.razorpayKey);

// capture the payment via stripe 
router.route('/stripePayment').post(isLoggedIn, paymentController.stripePayment);
// capture the payment via razorpay
router.route('/razorpayPayment').post(isLoggedIn, paymentController.razorpayPayment);

// export route
module.exports = router;