
// user model
const User = require('../models/User');

// bigPromise for functions
const BigPromise = require('../middlewares/bigPromise');

// for uploading files to cloudinary
const cloudinary = require('cloudinary').v2;

// for creating custom error message
const CustomError = require('../utils/customError');


// get list of all the user
module.exports.userList = BigPromise( async(req,res,next) => {

    // finding all the user
    const users = await User.find();

    // return list of all the users
    res.status(200).json({
        success:true,
        users
    });
})


// get a single user by id
module.exports.getSingleUser = BigPromise( async(req,res,next) => {
    
    // getting user by params id
    const user = await User.findById(req.params.id);

    // if user not found 
    if(!user){
        // show error message
        return next(new CustomError('No User found' , 400));
    }

    // return single user
    res.status(200).json({
        success:true,
        user
    });
})


// update a single user based on id
module.exports.updateSingleUser = BigPromise( async(req,res,next) => {
    
    // getting new values of email, role and name from user
    const newData = {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }

    // find user and update data
    const user = await User.findByIdAndUpdate(
        req.params.id,
        newData,
        {
            new:true,
            runValidators:true,
            useFindAndModify: false
        }
    )

    if(!user){
        return next(new CustomError('User does not exist, Please check the Id', 400));
    }

    res.status(200).json({
        success:true,
        user
    });

})


// delete a single user by id
module.exports.deleteSingleUser = BigPromise( async(req,res,next) => {
    
    // finding the user
    const user = await User.findById(req.params.id);

    // if user not found
    if(!user){
        return next(new CustomError('No User found' , 400));
    }

    // getting user id
    const imageId = user.photo.id;

    // delete image from cloudinary
    await cloudinary.uploader.destroy(imageId);

    // delete the user 
    await User.findByIdAndDelete(req.params.id);

    // return message
    res.status(200).json({
        success:true,
        message:"USER is removed from database"
    });
})