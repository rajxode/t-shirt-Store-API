

// product model
const Product = require('../models/Product');

// bigPromise for functions
const BigPromise = require('../middlewares/bigPromise');

// for uploading files to cloudinary
const cloudinary = require('cloudinary').v2;

// for creating custom error message
const CustomError = require('../utils/customError');


// controller for adding a new product
module.exports.addProduct = BigPromise(async(req,res,next) => {

    // checking whether user is uploading some images or not
    if(!req.files){
        return next(new CustomError('Please upload images', 400));
    }

    // array of images { incase user upload multiple images }
    let imageArray = [];

    // if there are some files
    if(req.files){


        // map over each image in array and upload on cloudinary
        for(let i = 0; i < req.files.photos.length; i++){

            // uploading 
            const result = await cloudinary.uploader.upload(req.files.photos[i].tempFilePath, {
                folder: process.env.CLOUD_PRODUCT_FOLDER
            })

            // push result of uploaded image in array
            imageArray.push(
                {
                    id:result.public_id,
                    secure_url:result.secure_url
                }
            )
        }
    }

    // store the array of uploaded image's result in req.body
    req.body.photos = imageArray;
    // id of user loggedIn
    req.body.user = req.user.id;

    // creating a new product inside the DB
    const product = await Product.create(req.body);

    // return response 
    res.status(201).json({
        success:true,
        product
    })

})