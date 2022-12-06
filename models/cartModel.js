const mongoose = require('mongoose');
const Objectid = mongoose.Types.ObjectId;
const CartSchema = new mongoose.Schema({
    user: {
        type: Objectid,
        required: true,
        ref: "UserData"
    },
    products: [{
            productId:
            {
                type:Objectid,
                ref: "productData"
            },
            quantity:{
                type:Number,
                default:1
            },

            total:
            {type:Number} 
        }],
    cartTotal : {
        type: Number,             
    },
    date: {
        type: Date,
        default: Date.now,
    },
    grandTotal: {
        type: Number,
        default:0,

    },
    discount: {
        couponId: Objectid,
        percentage: { type:Number, default:0}
    }
});



module.exports = cartModel = mongoose.model('Cart' , CartSchema)