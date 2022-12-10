const {cart, products} = require("../controllers/userController");
const addressModel = require("../models/addressModel");
const cartModel = require("../models/cartModel");
const orderModel = require("../models/orderModel")
const Razorpay = require("razorpay");
const couponModel = require('../models/coupon');

module.exports = {


    userSession: (req, res, next) => {
        if (req.session.userLogin) {
            next();
        } else {
            res.redirect("/login");
        }
    },

    adminSession:(req,res,next) => {
        if(req.session.adminLogin){
            next()
        } else {
            res.redirect("/admin/signin");
        }

    },



}