
// order model
const Order = require('../models/Order');

const Product = require('../models/Product');

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

// get all order of logged in user
module.exports.adminGetAllOrder = BigPromise( async(req,res,next) => {

    // getting all the order
    const orders = await Order.find();


    // return response
    res.status(201).json({
        success:true,
        orders
    });

})

// function to update the stock of a product on product delivery
async function updateProductStock(productId,quantity){

    // find the product by id
    const product = await Product.findById(productId);

    // reduce the product stock 
    product.stock = product.stock - quantity;

    // save the product inside the database
    await product.save({validateBeforeSave:false});
}


// for admin to update an order by id
module.exports.adminUpdateOrder = BigPromise( async(req,res,next) => {
    
    // getting order 
    const order = await Order.findById(req.params.id);

    // if the order is already delivered return back
    if(order.orderStatus === 'delivered'){
        return next(new CustomError('Order is already delivered', 400));
    }

    // update the order status
    order.orderStatus = req.body.orderStatus;

    // if order status is changed to delivered, decrease the product stock
    if(req.body.orderStatus === 'delivered'){
        order.orderItems.forEach( async (prod) => {
            // calling update stock function 
            await updateProductStock(prod.product , prod.quantity);
        })
    }

    // save the order
    await order.save();


    // return response
    res.status(201).json({
        success:true,
        order
    });

})


// for admin to delete an order by id
module.exports.adminDeleteOrder = BigPromise( async(req,res,next) => {
    
    // getting order by id and deleting it
    await Order.findByIdAndDelete(req.params.id);

    // return response
    res.status(201).json({
        success:true,
        message:'Order deleted'
    });

})