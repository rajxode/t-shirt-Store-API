
// express
const express = require('express');

// create router from express
const router = express.Router();

// controller
const productController = require('../controllers/productController');

// middleware to check whether user is loggedIn or not
const {isLoggedIn, customRole} = require('../middlewares/user');

// ========= for all users ==========

// get list of all the products
router.route('/getAllProducts').get(isLoggedIn, productController.getAllProducts);
// get data of a single product by it's Id
router.route('/getOneProduct/:id').get(isLoggedIn, productController.getOneProduct);
// to add a review on a product
router.route('/addReview/:id').put(isLoggedIn, productController.addReview);
// to delete your review from a product
router.route('/deleteReview/:id').delete(isLoggedIn, productController.deleteReview);
// to get list of all the reviews on a product
router.route('/allReview/:id').get(isLoggedIn, productController.getAllReviews);


// =========== for just admins ===========

// route for adding a product
router.route('/addProduct').post(isLoggedIn, customRole('admin'), productController.addProduct);
// route for getting list of all the products
router.route('/adminGetProducts').get(isLoggedIn, customRole('admin'), productController.adminGetProducts)

router.route('/:id')
        // for updating the product
        .put(isLoggedIn, customRole('admin'), productController.adminUpdateOne)
        // for deleting the product
        .delete(isLoggedIn, customRole('admin'), productController.adminDeleteOne)

// export route
module.exports = router;