// express
const express = require('express');

// create router from express
const router = express.Router();

// controller
const managerController = require('../controllers/managerController');

// middleware for user login
const {isLoggedIn,customRole} = require('../middlewares/user');


// get list of all the users with role as 'user'
router.route('/userList').get(isLoggedIn, customRole('manager'), managerController.userList);

// export route
module.exports = router;