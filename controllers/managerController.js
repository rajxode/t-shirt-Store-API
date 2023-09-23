
// user model
const User = require('../models/User');

// bigPromise for functions
const BigPromise = require('../middlewares/bigPromise');

// controller for user list
module.exports.userList = BigPromise(async(req,res,next) => {

    // finding all the user
    const users = await User.find({ role: 'user' });

    // return list of all the users
    res.status(200).json({
        success:true,
        users
    });
})