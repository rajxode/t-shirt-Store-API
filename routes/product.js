
// express
const express = require('express');

// create router from express
const router = express.Router();

// controller
const productController = require('../controllers/productController');

// middleware to check whether user is loggedIn or not
const {isLoggedIn, customRole} = require('../middlewares/user');

// route for adding a product
router.route('/addProduct').post(isLoggedIn, customRole('admin'), productController.addProduct);

router.route('/getAllProducts').get(isLoggedIn, productController.getAllProducts);
// export route
module.exports = router;