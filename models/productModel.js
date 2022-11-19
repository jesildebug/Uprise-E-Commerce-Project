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
    status : {
        type: String,
        default: "List"
    }


})

module.exports = productModel = mongoose.model('productData',productSchema);