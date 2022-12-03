const {cart, products} = require("../controllers/userController");
const addressModel = require("../models/addressModel");
const cartModel = require("../models/cartModel");
const orderModel = require("../models/orderModel")
const Razorpay = require("razorpay");

module.exports = {


    userSession: (req, res, next) => {
        if (req.session.userLogin) {
            next();
        } else {
            res.redirect("/login");
        }
    },

    addOrder: async (req, res, next) => {
        let userId = req.session.userId;
        let cart = await cartModel.findOne({userId});
        const cartTotal = cart.cartTotal;
        let addIndex = req.body.addIndex
        let profile = await  addressModel.findOne({ userId })
        let cartId = cart._id.toString();
        const now = new Date()
        const deliveryDate = now.setDate(now.getDate() + 7)
        const paymentMethod = req.body.paymentType
        console.log(paymentMethod);
        if (paymentMethod === "cod") {
            const orderModels = await orderModel.create({
                userId: userId,
                // products: productId,
                cartTotal: cartTotal,
                paymentMethod: req.body.paymentType,
                paymentStatus: "Pending",
                deliveryDate: deliveryDate
            });
            orderModels.save()
            .then(async()=>{
                await cartModel.findByIdAndDelete({_id: cart._id});
                res.json({status: true});
            })
        } else {
            console.log("Reached Online")
            var instance = new Razorpay({key_id: "rzp_test_X3YzIfgkfukV1B", key_secret: "MHq03BJw6Ya0xylomnUvIseA"});

            instance.orders.create({
                amount: cartTotal * 100,
                currency: "INR",
                // reciept: String(cartId)

            }, function (err, order) {
                if (err) {
                    console.log(err);

                } else {
                    console.log(order)
                    res.json({status: false, order})
                }
            });
        }


    }

}
