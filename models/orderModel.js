const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId

const orderSchema = new mongoose.Schema ({
    userId : {
        type: ObjectId,
        required: true
    },
    products : [{
            productId: { 
                type:ObjectId, 
                ref: 'Product'
            },

            orderStatus: {
                type: String,
                default: 'Order Placed'

            },
            quantity: Number,
            total :  Number
    }],
    paymentStatus: {
        type: String,
        default: 'Pending'
    }, 
    cartTotal: Number,
    phone: {
        type: Number,
    },
    address: {
        fullName: {
            type: String,
            required: true
        },
        pincode: {
            type: Number,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        currentAddress: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
    },
    paymentMethod: {
        type: String,
    },
    deliveryDate: {
        type: Date
    },
    date: {
        type: Date,
        default: Date.now()
    }
})


const Order = mongoose.model('Order', orderSchema)

module.exports = Order