
const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');

router.route('/signup').get(userController.signup);

module.exports = router;