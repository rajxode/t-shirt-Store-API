
// import mongoose
const mongoose = require('mongoose');

// creating schema
const productSchema = new mongoose.Schema({
    // product name
    name:{
        type:String,
        // require 
        required:[true, 'Please give a name for the product'],
        // remove extra spaces at the end of string
        trim:true,
        // max length of name
        maxlength:[120, 'Name cannot be greater than 120 characters'],
    },
    // price of product
    price:{
        type:Number,
        required:[true, 'Please define the price of product'],
        // max length of price
        maxlength: [6, 'Product price cannot be greater than 6 digits']
    },
    // product description 
    description:{
        type:String,
        required:[true, 'Please give description about the product']
    },
    // photos related to the product 
    // following is an array because there can be multiple photos
    photos:[
        // single item of array
        {
            // id from cloudinary
            id:{
                type:String,
                required:true
            },
            // url from cloudinary
            secure_url:{
                type:String,
                required:true
            }
        }
    ],
    // product category
    category:{
        type: String,
        // required
        // if user doesn't give any value for category then show this message
        required:[true, 'Please select a category for your product from short-sleeves, long-sleeves, sweatshirts, hoodies'],
        // predefine values for product category
        enum: {
            values:[
                'shortSleeves',
                'longSleeves',
                'sweatShirts',
                'hoodies'
            ],
            // if user give a value other than the above mentioned values then show following message
            message:"Please select category values ONLY from the short-sleeves, long-sleeves, sweatshirts, hoodies"
        }
    },
    // product brand name
    brand:{
        type: String,
        required:[true, 'Please give a brand name']
    },
    // product average rating
    ratings:{
        type:Number,
        default: 0
    },
    // total number of reviews on product
    numberOfReviews:{
        type:Number,
        default: 0
    },
    // list reviews
    reviews:[
        {   
            // user who give the review
            user:{
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required:true,
            },
            // name of user
            name:{
                type:String,
                required:true,
            },
            // rating provided
            rating:{
                type:Number,
                required:true
            },
            // comment/feedback about the product
            comment:{
                type:String,
                required:true
            }
        }
    ],
    // user who added the product
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true,
    },
    // product creation time
    createdAt:{
        type: Date,
        default: Date.now,
    }
});



// export the model
module.exports = mongoose.model('Product',productSchema);