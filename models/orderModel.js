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
                ref: 'productData'
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
            
        },
        pincode: {
            type: Number,
            
        },
        country: {
            type: String,
           
        },
        currentAddress: {
            type: String,
           
        },
        city: {
            type: String,
            
        },
        state: {
            type: String,
           
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
    },
    updateDate: {
        type:Date
    }
})


const Order = mongoose.model('Order', orderSchema)

module.exports = Order