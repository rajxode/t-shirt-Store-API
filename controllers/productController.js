

// product model
const Product = require('../models/Product');

// bigPromise for functions
const BigPromise = require('../middlewares/bigPromise');

// for uploading files to cloudinary
const cloudinary = require('cloudinary').v2;

// for creating custom error message
const CustomError = require('../utils/customError');
const WhereClause = require('../utils/whereClause');


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

        // incase user send more than 1 image
        if( req.files.photos.length > 1){

            // map over each image
            for(let i = 0; i < req.files.photos.length; i++){

                // get every file
                const file = req.files.photos[i];
                
                // uploading each file
                const result = await cloudinary.uploader.upload(file.tempFilePath,{
                    folder:process.env.CLOUD_PRODUCT_FOLDER
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

        // incase user send only one image
        // seperate function for single image because single image comes as an object and not as an array
        else{
            
            // get the file
            const file = req.files.photos;
            
            // uploading 
            const result = await cloudinary.uploader.upload(file.tempFilePath,{
                folder:process.env.CLOUD_PRODUCT_FOLDER
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


module.exports.getAllProducts = BigPromise(async(req,res,next) => {

    // show product on each page
    const showPerPage = 4;

    // number of total products inside the database
    const totalProduct = await Product.countDocuments();


    // getting result in the form of object from the WhereClause class
    // providing base = Product.find()          // search all the product
    // providing bigQuery = req.query
    let productsObj = new WhereClause(Product.find() , req.query )
                    // search for all the products
                    .search()
                    // filter products
                    .filter();



    // getting list of products from the above object
    let products = await productsObj.base;

    // length of resultant product from class
    const filteredProducts = products.length;

    // apply page function on the result products
    productsObj.pager(showPerPage);
    // update products array by new pager values
    // use .clone() when performing  chain process of mongoose operation
    products = await productsObj.base.clone();


    // finally return the data
    res.status(200).json({
        success:true,
        products,
        filteredProducts,
        totalProduct
    })
});