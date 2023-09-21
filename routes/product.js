
// express
const express = require('express');

// create router from express
const router = express.Router();

// controller
const productController = require('../controllers/productController');

const {isLoggedIn, customRole} = require('../middlewares/user');


router.route('/').get(productController.home);

// export route
module.exports = router;