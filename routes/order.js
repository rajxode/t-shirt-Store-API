// express
const express = require('express');

// create router from express
const router = express.Router();

// controller
const orderController = require('../controllers/orderController');

// middleware for user login
const {isLoggedIn,customRole} = require('../middlewares/user');

// define route with controller
router.route('/create').post(isLoggedIn, orderController.createOrder);

// export route
module.exports = router;