

// product model
const Product = require('../models/Product');

// bigPromise for functions
const BigPromise = require('../middlewares/bigPromise');

// for uploading files to cloudinary
const cloudinary = require('cloudinary').v2;

// for creating custom error message
const CustomError = require('../utils/customError');
const WhereClause = require('../utils/whereClause');


// controller for Admin to add a new product
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

// controller for Admin to get list of all the products
module.exports.adminGetProducts = BigPromise(async(req,res,next) => {

    const products = await Product.find();

    // finally return the data
    res.status(200).json({
        success:true,
        products,
    })
});

// controller for admin to update any product by id
module.exports.adminUpdateOne = BigPromise(async(req,res,next) => {

    // finding product
    let product = await Product.findById(req.params.id);

    // if no product found
    if(!product){
        return next(new CustomError('No product found' , 401));
    }

    // if user wants to update images also
    if(req.files){

        // create new array for images
        let imageArray = [];

        // first remove the previously saved images
        for(let i = 0; i < product.photos.length; i++){
            // get file id from photo array
            const file = product.photos[i].id;
        
            // remove each file
            await cloudinary.uploader.destroy(file)
        }


        // now add the new images
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

        // store the array of new uploaded images inside req.body
        req.body.photos = imageArray;
    }

    // update the product data with the value provided by the user
    product = await Product.findByIdAndUpdate(
                            // product id
                            req.params.id,
                            // data to be updated
                            req.body,
                            {
                                new:true,
                                runValidators:true,
                                useFindAndModify: false,
                            }
                        );

    // finally return the data
    res.status(200).json({
        success:true,
        product,
    })
});

// controller for admin to update any product by id
module.exports.adminDeleteOne = BigPromise(async(req,res,next) => {

    // finding product
    let product = await Product.findById(req.params.id);

    // if no product found
    if(!product){
        return next(new CustomError('No product found' , 401));
    }

    // first remove the previously saved images
    for(let i = 0; i < product.photos.length; i++){
        // get file id from photo array
        const file = product.photos[i].id;
        // remove each file
        await cloudinary.uploader.destroy(file)
    }

    // find the product and then delete it
    await Product.findByIdAndDelete(req.params.id);

    // finally return the data
    res.status(200).json({
        success:true,
        message:'Product is deleted'
    })
});





// for all the users to get list of all the products
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

// for all the users to get a single product by it's id
module.exports.getOneProduct = BigPromise(async(req,res,next) => {

    // getting product by it's id
    const product = await Product.findById(req.params.id);

    // if no product found
    if(!product){
        return next(new CustomError('No product found', 401));
    }

    // if product found
    // return product as response
    res.status(200).json({
        success:true,
        product
    })
})

// for all the users to add a review on a product
module.exports.addReview = BigPromise(async(req,res,next) => {
    
    // getting product id from params
    const productId = req.params.id;

    // getting value from req.body
    const { rating, comment } = req.body;

    // creating a new review from values given by user
    const review = {
        // uesr who creating review
        user:req.user._id,
        // name of user
        name:req.user.name,
        // rating
        rating: Number(rating),
        // comment
        comment
    }

    // finding the product on which we have to add the review
    const product = await Product.findById(productId);

    // if no product found for the id
    if(!product){
        return next(new CustomError('No product found', 401));
    }

    // check whether the user has already given a review on the product
    const alreadyReviewed = product
                            .reviews
                            // mapping over each review and checking uesr id for the review
                            .find( (rev) => rev.user.toString() === req.user._id.toString());


    // if user has already given review on the product
    if(alreadyReviewed){
        // udpate the review

        // map over each review
        product.reviews.forEach((review) => {
            // if review found
            if(review.user.toString() === req.user._id.toString()){
                // update the comment and rating
                review.comment = comment;
                review.rating = Number(rating);
            }
        })
    }
    // if user has not posted any review before 
    // create a new one
    else{
        // push the review inside the array
        product.reviews.push(review);
        // increse the number of total reviews
        product.numberOfReviews = product.reviews.length;
    }

    // adjust average ratings of product
    // average = total ratings / number of ratings
    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    // save the product 
    await product.save({validateBeforeSave: false});

    // return the response
    res.status(200).json({
        success:true,
        message:'Added Review'
    })
})


// for all the users to delete their review on a product
module.exports.deleteReview = BigPromise(async (req,res,next) => {

    // getting productId
    const productId = req.params.id;

    // finding the product on which we have to add the review
    const product = await Product.findById(productId);

    // if no product found for the id
    if(!product){
        return next(new CustomError('No product found', 401));
    }

    // creating new reviews array
    // remove the review of user loggedIn
    const reviews = product.reviews.filter(
        (rev) => rev.user.toString() !== req.user._id.toString()
    );

    // total number of reviews
    const numberOfReviews = reviews.length;

    // adjust ratings
    // if there was just a single review inside the array, we get result as 0/0 which is NaN, therefore using OR operator to give return 0 in such case
    const ratings = Number( reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length) || 0;

    //update the product
    await Product.findByIdAndUpdate(
                    // id of product
                    productId,
                    {
                        // data to be updated
                        reviews,
                        ratings,
                        numberOfReviews,
                    },
                    {
                        new: true,
                        runValidators: true,
                        useFindAndModify: false,
                    }
                );
    
    // return response 
    res.status(200).json({
    success: true,
    message:'Review deleted'
    });
})


// to get just all the reviews on a product
module.exports.getAllReviews = BigPromise(async(req,res,next) => {

    // getting productId
    const productId = req.params.id;

    // finding the product on which we have to add the review
    const product = await Product.findById(productId);

    // if the product doesn't exist
    if(!product){
        return next(new CustomError('No product found' , 401));
    }

    // return the response
    res.status(200).json({
        success:true,
        reviews: product.reviews
    })
})

