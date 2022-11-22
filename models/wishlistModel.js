const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;


const WishlistSchema =new mongoose.Schema({
    user:{
        type:ObjectId,
        required:true,
        ref:"UserData"
    },
    products:{
        type:[ObjectId],
        required: true,
        ref:"productData"
    },
    date:{
        type:Date,
        default:Date.now,
    },
});

const Wishlist = mongoose.model("Wishlist",WishlistSchema);
module.exports= Wishlist;