// express
const express = require('express');

// create router from express
const router = express.Router();

// controller
const paymentController = require('../controllers/paymentController');

// middleware for user login
const {isLoggedIn} = require('../middlewares/user');


// define route with controller
router.route('/stripeKey').get(isLoggedIn, paymentController.stripeKey);
router.route('/razorpayKey').get(isLoggedIn, paymentController.razorpayKey);

router.route('/stripePayment').post(isLoggedIn, paymentController.stripePayment);
router.route('/razorpayPayment').post(isLoggedIn, paymentController.razorpayPayment);

// export route
module.exports = router;