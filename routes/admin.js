// express
const express = require('express');

// create router from express
const router = express.Router();

// controller
const adminController = require('../controllers/adminController');

// middleware for user login
const {isLoggedIn,customRole} = require('../middlewares/user');


// define route with controller
router.route('/userList').get(isLoggedIn, customRole('admin'), adminController.userList);
router.route('/singleUser/:id')
        // get a single user based on id
        .get(isLoggedIn, customRole('admin'), adminController.getSingleUser)
        // update a single user based on id
        .put(isLoggedIn, customRole('admin'), adminController.updateSingleUser)
        // delete a single user based on id
        .delete(isLoggedIn, customRole('admin'), adminController.deleteSingleUser)

// for products related routes
router.use('/product',require('./product'));

// export route
module.exports = router;