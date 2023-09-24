
// order model
const Order = require('../models/Order');

// bigPromise 
const BigPromise = require('../middlewares/bigPromise');

// for errors
const CustomError = require('../utils/customError');

// controller for creating a order
module.exports.createOrder = BigPromise( async(req,res,next) => {

    // get all the order related values from req.body
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        taxAmount,
        shippingAmount,
        totalAmount,
    } = req.body;

    // create a new order inside the database
    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        taxAmount,
        shippingAmount,
        totalAmount,
        user: req.user._id,
    });

    // response
    res.status(201).json({
        success:true,
        order
    });

})

// get one order detail by order id
module.exports.getOneOrder = BigPromise( async(req,res,next) => {

    // getting the order by id
    const order = await Order.findById(req.params.id)
                    // populate the value of user who placed the order
                    .populate('user','name email')
                    // populate the value of product purchased
                    .populate('orderItems.product','name');

    // if no order found with id
    if(!order){
        return next(new CustomError('No order found' , 401));
    }

    // return response
    res.status(201).json({
        success:true,
        order
    });

})

// get all order of logged in user
module.exports.getAllOrder = BigPromise( async(req,res,next) => {

    // getting all the order for a user by it's id
    const orders = await Order.find({user: req.user._id});

    // if no order found 
    if(!orders){
        return next(new CustomError('No order found' , 401));
    }

    // return response
    res.status(201).json({
        success:true,
        orders
    });

})