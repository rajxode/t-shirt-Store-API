const User = require('../models/User');
const BigPromise = require('../middlewares/bigPromise');
const cookieGenerator = require('../utils/cookieGenerator');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;
const CustomError = require('../utils/customError');

module.exports.signup = BigPromise( async (req,res,next) => {
    
    const { name , email, password} = req.body;

    if(!email || !name || !password){
        // creating a custom error using class
        // return next(new Error('Give all values')); 
        return next(new CustomError('Name, Email and Password cannot be empty', 400) );
    }


    if(!req.files) {
        return next(new CustomError('Please upload image', 400) );
    }

    const file = req.files.photo;
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

    cookieGenerator(user,res);
    
});