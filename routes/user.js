
// express
const express = require('express');

// create router from express
const router = express.Router();

// controller
const userController = require('../controllers/userController');

// middle ware to check whether user is logged in or not
const {isLoggedIn} = require('../middlewares/user');


// define route with controller
// signup route
router.route('/signup').post(userController.signup);
// login route
router.route('/login').post(userController.login);
// logout route
router.route('/logout').get(userController.logout);
// forgetPassword
router.route('/forgetpassword').post(userController.forgetPassword);
// reset the Password
router.route('/password/reset/:token').post(userController.resetPassword);
// dashboard
router.route('/dashboard').get(isLoggedIn, userController.userDashboard);
// update password
router.route('/password/update').post(isLoggedIn, userController.updatePassword);
// update user's info
router.route('/dashboard/updateInfo').post(isLoggedIn, userController.updateUserInfo);

// export route
module.exports = router;