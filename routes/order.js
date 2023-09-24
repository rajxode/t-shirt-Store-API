// express
const express = require('express');

// create router from express
const router = express.Router();

// controller
const orderController = require('../controllers/orderController');

// middleware for user login
const {isLoggedIn,customRole} = require('../middlewares/user');

// ================ for admin 

// get list of all the order
router.route('/getAllOrder').get(isLoggedIn, customRole('admin'), orderController.adminGetAllOrder);
// update an order by id
router.route('/update/:id').put(isLoggedIn, customRole('admin'), orderController.adminUpdateOrder);
// delete an order by id
router.route('/delete/:id').delete(isLoggedIn, customRole('admin'), orderController.adminDeleteOrder);

// ================= for all logged in user

// to create an order
router.route('/create').post(isLoggedIn, orderController.createOrder);
// to get list of all the orders for logged in user
router.route('/myorder').get(isLoggedIn, orderController.getAllOrder);
// to get a single order by it's id
router.route('/:id').get(isLoggedIn, orderController.getOneOrder);
        

// export route
module.exports = router;