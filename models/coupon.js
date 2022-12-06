var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var couponSchema = new Schema({
  couponCode: {
    type: String,
  },
  discount: {
    type: Number,
  },
  users:{
    type:[Schema.Types.ObjectId],
  },
  disable:{
    type: Boolean,
    default: false,
  },
 maxLimit: {
  type:Number
 },
 minLimit: {
  type:Number
 },
 expDate: {
  type: Date

 }
});

module.exports = mongoose.model("coupon", couponSchema);