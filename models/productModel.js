const mongoose = require('mongoose');
const Objectid = mongoose.Types.ObjectId
const productSchema = new mongoose.Schema({
    brand : {
        type: Objectid,
        required: true,
        ref:"BrandData"
    },   

    model : {
        type: String,
        required:true,
    },
    description : {
        type: String,
        required:true,
    },
    price :{
        type: Number,
        required:true
    },
    image: {
        type: [String],
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    status : {
        type: String,
        default: "List"
    },
    date: {
        type: Date,
        default: Date.now()
    }


})

module.exports = productModel = mongoose.model('productData',productSchema);