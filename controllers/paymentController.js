
// bigPromise for functions
const BigPromise = require('../middlewares/bigPromise');

const stripe = require('stripe')(process.env.STRIPE_SECRET);
const Razorpay = require('razorpay');


// controller to return stripe public key
module.exports.stripeKey = BigPromise(async(req,res,next) => {
    // return key
    res.status(200).json({
        stripeKey:process.env.STRIPE_API_KEY
    })
});

// controller to return razorpay public key
module.exports.razorpayKey = BigPromise(async(req,res,next) => {
    // return the key
    res.status(200).json({
        razorpayKey:process.env.RAZORPAY_API_KEY
    })
});


// capture the payment 
module.exports.stripePayment = BigPromise(async(req,res,next) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: 'inr',

        // optional
        metadata: { integration_check: 'accept_a_payment' }
    });

    res.status(200).json({
        success:true,
        client_secret: paymentIntent.client_secret
    })
});


// capture payment using razorpay
module.exports.razorpayPayment = BigPromise(async(req,res,next) => {

    // creating razorpay instance for creating order
    var instance = new Razorpay({
        key_id: process.env.RAZORPAY_API_KEY,
        key_secret: process.env.RAZORPAY_SECRET,
      });
    
    // options for creating new order
    var options = {
        // to be converted into paise
        amount: req.body.amount * 100, 
        // curreny
        currency: "INR",
    };

    // creating new order from instance
    const myOrder = await instance.orders.create(options);

    // response
    res.status(200).json({
        success: true,
        amount: req.body.amount,
        orderId: myOrder.id,
    });

});