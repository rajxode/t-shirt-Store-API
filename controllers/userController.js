const User = require('../models/User');
const BigPromise = require('../middlewares/bigPromise');
const cookieGenerator = require('../utils/cookieGenerator');

module.exports.signup = BigPromise( async (req,res,next) => {
    
    const { name , email, password} = req.body;

    if(!email || !name || !password){
        // creating a custom error using class
        // return next(new Error('Give all values')); 
        return next(new CustomError('Name, Email and Password cannot be empty', 400) );
    }

    // create new user
    const user = await User.create({
        name,
        email,
        password
    });

    cookieGenerator(user,res);
    
});