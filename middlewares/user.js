
// getting user data
const User = require('../models/User');
// bigpromise
const BigPromise = require('./bigPromise');
// custom error 
const CustomError = require('../utils/customError');
// jwt for token
const jwt = require('jsonwebtoken');


// to check whether user is loggedin or not
exports.isLoggedIn = BigPromise(async( req,res,next) => {
    
    // getting the value of token from cookies / header
    const token = req.cookies.token ;
    // ||  req.header("Authorization").replace('Bearer ','') ;

    // if no token is present 
    if(!token){
        // return error message for user to login
        return next(new CustomError('Please login first', 401));
    }


    // if token found 
    // decode it to get the values stored inside the token
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // find user from value of id inside the decoded JWT token
    // store the user inside req
    req.user = await User.findById(decode.id);

    // call the next operation
    next();
})