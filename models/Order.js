
// import mongoose
const mongoose = require('mongoose');

// creating schema
const orderSchema = new mongoose.Schema({
    // info of the address where the product needs to be shipped
    shippingInfo:{
        // address
        address:{
            type: String,
            required: [true, 'Please enter your address']
        },
        // city name
        city:{
            type: String,
            required: [true, 'Please enter your city']
        },
        // contact number
        phoneNo:{
            type: String,
            required: [true, 'Please enter your phone number']
        },
        // state name
        state:{
            type: String,
            required: [true, 'Please enter your state']
        },
        // postal code
        pincode:{
            type: String,
            required: [true, 'Please enter your postal code']
        },
        // country name
        country:{
            type: String,
            required: [true, 'Please enter your country name']
        },
    },
    // user who placed the order
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true,
    },
    // data about the product
    orderItem:[
        {   
            // name
            name:{
                type: String,
                required: [true, 'Please provide the product name'],
            },
            // qunatity
            quantity:{
                type: Number,
                required: [true, 'Please provide the product quantity'],
            },
            // image of the product
            image:{
                type: String,
                required: [true, 'Please provide the product image'],
            },
            // price of the product
            price:{
                type: Number,
                required: [true, 'Please provide the product price'],
            },
            // product ref from schema
            product:{
                type: mongoose.Schema.ObjectId,
                ref:'Product',
                required: true,
            },
        }
    ],
    // info about the payment
    paymentInfo:{
        id:{
            type: String,
        }
    },
    // tax amount on the product
    taxAmount:{
        type: Number,
        required: [true, 'Please provide the tax amount'],
    },
    // shipping amount on product
    shippingAmount:{
        type: Number,
        required: [true, 'Please provide the shipping amount'],
    },
    // total amount of the product
    totalAmount:{
        type: Number,
        required: [true, 'Please provide the total amount'],
    },
    // status of order 
    orderStatus:{
        type: String,
        required: [true, 'Please select the order status from processing, delivered, cancelled '],
        enum: {
            values:[
                // different values of status
                'processing',
                'delivered',
                'cancelled',
            ],
            // if user give a value other than the above mentioned values then show following message
            message:"Please select status values ONLY from the processing, delivered, cancelled"
        },
        default: 'processing'
    },
    // time when the order is delivered
    deliveredAt:{
        type: Date
    },
    // order creation time
    createdAt:{
        type: Date,
        default: Date.now,
    }
});



// export the model
module.exports = mongoose.model('Order',orderSchema);