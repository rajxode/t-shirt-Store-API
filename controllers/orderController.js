
const Order = require('../models/Order');

const Product = require('../models/Product');

const BigPromise = require('../middlewares/bigPromise');


module.exports.createOrder = BigPromise( async(req,res,next) => {

    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        taxAmount,
        shippingAmount,
        totalAmount,
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        taxAmount,
        shippingAmount,
        totalAmount,
        user: req.user._id,
    });

    res.status(201).json({
        success:true,
        order
    });

})