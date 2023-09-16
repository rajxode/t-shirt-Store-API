
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