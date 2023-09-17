
// user model
const User = require('../models/User');

// bigPromise for functions
const BigPromise = require('../middlewares/bigPromise');

// to create a cookie token
const cookieGenerator = require('../utils/cookieGenerator');

// for uploading files
const fileUpload = require('express-fileupload');

// for uploading files to cloudinary
const cloudinary = require('cloudinary').v2;

// for creating custom error message
const CustomError = require('../utils/customError');



// sign up controller
module.exports.signup = BigPromise( async (req,res,next) => {
    
    // getting user's data
    const { name , email, password} = req.body;


    // if some data is not present show error message
    if(!email || !name || !password){
        // creating a custom error using class
        // return next(new Error('Give all values')); 
        return next(new CustomError('Name, Email and Password cannot be empty', 400) );
    }


    // if user didn't uploaded photo
    if(!req.files) {
        // error 
        return next(new CustomError('Please upload image', 400) );
    }


    // get uploaded image
    const file = req.files.photo;
    // upload the image to cloudinary
    const result = await cloudinary.uploader.upload(file.tempFilePath,{
        folder:process.env.CLOUD_FOLDER,
        width:150,
        crop:'scale'
    })


    // create new user
    const user = await User.create({
        name,
        email,
        password,
        photo:{
            id:result.public_id,
            secure_url:result.secure_url
        }
    });

    // generate a token and store in cookie
    cookieGenerator(user,res);
    
});


// for logging in the user
module.exports.login = BigPromise(async (req,res,next) => {
    
    // get the entered values of email and password
    const {email,password} = req.body;

    // if user doesn't provide all the values
    if(!email || !password){
        return next(new CustomError('Please provide values for email and password', 400));
    }

    // to get the user from database by his/her email id
    // (.select) = to get value of password also from database, which is initially hide for access inside the schema
    const user = await User.findOne({email}).select('+password');


    // if user doesn't found inside the database
    if(!user){
        return next(new CustomError('Email address does not exist', 400));
    }


    // match the user's entered password  with password saved inside the database
    const isValidUser = await user.isPasswordMatch(password);


    // if both password doesn't match
    if(!isValidUser){
        return next(new CustomError('Email or password is incorrect', 400));      
    }

    // if the user's is validated then create a token for him
    cookieGenerator(user,res);
})


// to logout user
module.exports.logout = BigPromise(async (req,res,next) => {
    res.cookie('token',null,{
        expires: new Date(
            Date.now()
        ),
        httpOnly: true,
    });

    res.status(200).json({
        success:true,
        message:"User logout successfully"
    })
})