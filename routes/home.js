
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

// export the router
module.exports = router;