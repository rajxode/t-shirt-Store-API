
// user model
const User = require('../models/User');

// bigPromise for functions
const BigPromise = require('../middlewares/bigPromise');

// to create a cookie token
const cookieGenerator = require('../utils/cookieGenerator');

// for uploading files to cloudinary
const cloudinary = require('cloudinary').v2;

// for creating custom error message
const CustomError = require('../utils/customError');
const mailHelper = require('../utils/emailHelper');
const crypto = require('crypto');



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


// to send a mail to user for reset the password
module.exports.forgetPassword = BigPromise(async (req,res,next) => {

    // getting user's email 
    const {email} = req.body;

    // if user doesn't give an email
    if(!email){
        return next(new CustomError('Please give value for email', 400));
    }

    // find user in database
    const user = await User.findOne({email});

    // if user doesn't exists inside the database
    if(!user){
        return next(new CustomError('User does not exists', 400));
    }

    // getting a token for reset password for user
    const forgetToken = user.resetPasswordToken();

    // save the token inside the database as it was not saved initially
    // save without validating any previous values 
    await user.save({validateBeforeSave: false})

    // creating a custom url for user to reset password
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/user/password/reset/${forgetToken}`;

    // craft a message for user containing the above created url
    const message = `Copy-Paste this link in your url for reset the password \n\n ${resetPasswordUrl}`;


    // sending mail to user's email address
    try {
        // using helper function created using nodemailer
        await mailHelper({
            // address on which the mail will be sent
            toMail: user.email,
            // email subject
            subject: 'Reset password',
            // email message
            message
        });
        
        // return success message on sending message
        return res.status(200).send({
            success:true,
            message:'Email send to your registered email address '
        })
    
    // if there is some error in sending mail 
    } catch (error) {
        // reset value of token and token expiry time
        user.forgetPasswordToken=undefined;
        user.forgetPasswordExpiry=undefined;
        // save user in DB
        await user.save({validateBeforeSave: false});

        // send error message 
        return next(new CustomError(error.message, 500));
    }
})


module.exports.resetPassword = BigPromise(async (req,res,next) => {

    // getting token from params
    const token = req.params.token;

    // encrypt the token to compare with token inside the database
    const forgetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

    // finding the user having same encrypted forgetPasswordToken
    const user = await User.findOne({
        forgetPasswordToken,
        // check whether the token time is valid or not
        forgetPasswordExpiry: { $gt: Date.now() }
    });

    // if no user found
    if(!user){
        // show message
        return next(new CustomError('Token is invalid / expired ', 400));
    }

    // if user found 
    // get value of new password and confirm password from body
    if( req.body.password !== req.body.cnfPassword){
        return next(new CustomError('Password and confirm password does not match', 400));
    }


    // update the user's password
    user.password = req.body.password;

    // reset values of forgetToken and the expiry time 
    user.forgetPasswordToken = undefined;
    user.forgetPasswordExpiry = undefined;

    // save the user inside the database
    await user.save();

    // return the token
    cookieGenerator(user,res);
})


// to return loggedIn user's data
module.exports.userDashboard = BigPromise(async (req,res,next) => {
    
    // get user data from database by his id
    const user = await User.findById(req.user.id);

    // return user's data
    res.status(200).json({
        success: true,
        user
    });
})


// to return loggedIn user's data
module.exports.updatePassword = BigPromise(async (req,res,next) => {


    // get user data(including password) from database using user's id
    const user = await User.findById(req.user.id).select('+password');

    // checking whether the old password matches with db
    const isVerified = await user.isPasswordMatch(req.body.oldPassword);

    // if password doesn't match
    if(!isVerified){
        return next(new CustomError('Incorrect old password', 400));
    }

    // if password match
    // check whether new entered password and confirm password match or not
    if(req.body.newPassword !== req.body.cnfPassword){
        return next(new CustomError('New password and Confirm password does not match', 400));
    }

    // save new password
    user.password = req.body.newPassword;

    // save data inside the database
    await user.save();
    // generate new token
    cookieGenerator(user,res);
})

// update user's info (except password)
module.exports.updateUserInfo = BigPromise(async (req,res,next) => {

    // getting new values of email and name from user
    const newData = {
        name:req.body.name,
        email:req.body.email,
    }


    // checking whether there is any files
    if(req.files){  

        // if user uploades a new file

        const user = await User.findById(req.user.id);
        // get photo id of previously uploaded image
        const imageId = user.photo.id;

        // delete the previously uploaded image
        const delResult = await cloudinary.uploader.destroy(imageId);

        // upload the new image on cloudinary
        const result = await cloudinary.uploader.upload(req.files.photo.tempFilePath,{
            folder:process.env.CLOUD_FOLDER,
            width:150,
            crop:'scale'
        })

        // store data of new uploaded image inside the newData object
        newData.photo = {
            id:result.public_id,
            secure_url:result.secure_url,
        }
    }

    // update the user's data inside the database
    const user = await User.findByIdAndUpdate(
                            // finding user inside the db with id
                            req.user.id,
                            // update data with new data
                            newData,
                            // options for updating
                            {
                                new:true,
                                runValidators:true,
                                useFindAndModify: false,
                            }
                        );
    
    // return updated user
    res.status(200).json({
        success:true,
        user
    });
    
})