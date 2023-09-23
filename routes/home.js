
// express
const express = require('express');

// create router from express
const router = express.Router();

// controller
const homeController = require('../controllers/homeController');

// Routes

// homepage
router.get('/',homeController.home);
// for all /user routes
router.use('/user',require('./user'));
// for admin routes
router.use('/admin',require('./admin'));
// for managers routes
router.use('/manager',require('./manager'));
// for products related routes
router.use('/product',require('./product'));


// export the router
module.exports = router;