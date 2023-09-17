
// express
const express = require('express');

// create router from express
const router = express.Router();

// controller
const userController = require('../controllers/userController');

// define route with controller

// signup route
router.route('/signup').post(userController.signup);
// login route
router.route('/login').post(userController.login);

// export route
module.exports = router;