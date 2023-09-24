// express
const express = require('express');

// create router from express
const router = express.Router();

// controller
const adminController = require('../controllers/adminController');

// middleware for user login
const {isLoggedIn,customRole} = require('../middlewares/user');


// define route with controller

// to get list of all the users
router.route('/userList').get(isLoggedIn, customRole('admin'), adminController.userList);

// perform operation on a sinle user by his id
router.route('/singleUser/:id')
        // get a single user based on id
        .get(isLoggedIn, customRole('admin'), adminController.getSingleUser)
        // update a single user based on id
        .put(isLoggedIn, customRole('admin'), adminController.updateSingleUser)
        // delete a single user based on id
        .delete(isLoggedIn, customRole('admin'), adminController.deleteSingleUser)

        
// for products related routes
router.use('/product',require('./product'));
// for products related routes
router.use('/order',require('./order'));


// export route
module.exports = router;