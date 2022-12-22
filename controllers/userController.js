
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
const productModel = require("../models/productModel");
const cartModel = require("../models/cartModel");
const wishlistModel = require("../models/wishlistModel");
const userModel = require('../models/userModel');
const brandModel = require('../models/brandModel');
const addressModel = require('../models/addressModel');
const orderModel = require('../models/orderModel');
const couponModel = require('../models/coupon')
const BannerModel = require('../models/banner')
const Razorpay = require("razorpay")
const { response } = require('express')
const moment = require('moment')
const { findOneAndUpdate } = require('../models/userModel');
const AdminModel = require("../models/adminModel")



var fullname;
var username;
var email;
var phone;
var password;


var otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);
console.log(otp);


let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: 'Gmail',

    auth: {
        user: 'prowireless82@gmail.com',
        pass: 'ugpsnkuvsksmknlq'
    }

});


module.exports = {


    userSession: (req, res, next) => {
        if (req.session.userLogin) {
            next();
        } else {
            res.redirect("/login");
        }
    },


    loginpage: (req, res) => {
        res.render("user/login")
    },


    homepage: async (req, res) => {

        const userId = req.session.userId
        const brand = await brandModel.find()
        const banners = await BannerModel.find({ status: "List" })
        const products = await productModel.find().populate('brand').sort({ date: -1 }).limit(4)
        if (req.session.userLogin) {


            res.render("user/home", {
                login: true,
                user: req.session.user,
                banners,
                products,
                brand,
                userId

            });
        } else {
            res.render('user/home', {
                login: false,
                banners, user: "", products, brand, userId
            });

        }


    },

    signuppage: (req, res) => {
        res.render("user/signup")
    },


    products: async (req, res) => {
        try {

       
            const page = parseInt(req.query.page) || 1;
            const perPage = 6;
            const sort = req.query.sort;
            const category = req.query.cat;
            let products;
            const countAllProduct = await productModel
                .find({ status: "List" }).populate('brand')
                .countDocuments();
            const pageNum = Math.ceil(countAllProduct / 4);
            if (sort == "new") {
                products = await productModel
                    .find({ status: "List" }).populate('brand')
                    .sort({ date: -1 })
                    .skip((page - 1) * perPage)
                    .limit(perPage);
            } else if (sort == "ascending") {
                products = await productModel
                    .find({ status: "List" }).populate('brand')
                    .sort({ price: 1 })
                    .skip((page - 1) * perPage)
                    .limit(perPage);

            } else if (sort == "descendig") {
                products = await productModel
                    .find({ status: "List" }).populate('brand')
                    .sort({ price: -1 })
                    .skip((page - 1) * perPage)
                    .limit(perPage);
            } else if (sort == "15000-20000") {
                products = await productModel
                    .find({ status: "List", price: { $gte: 15000, $lte: 20000 } }).populate('brand')
                    .skip((page - 1) * perPage)
                    .limit(perPage);
            } else if (sort == "20000-40000") {
                products = await productModel
                    .find({ status: "List", price: { $gte: 20000, $lte: 50000 } }).populate('brand')
                    .skip((page - 1) * perPage)
                    .limit(perPage);
            } else if (sort == "40000-100000") {
                products = await productModel
                    .find({ status: "List", price: { $gte: 50000, $lte: 100000 } }).populate('brand')
                    .skip((page - 1) * perPage)
                    .limit(perPage);
            } else if (sort == "100000") {
                products = await productModel
                    .find({ status: "List", price: { $lte: 1000000 } }).populate('brand')
                    .skip((page - 1) * perPage)
                    .limit(perPage);
            } else {
                products = await productModel
                    .find({ status: "List" }).populate('brand')
                    .skip((page - 1) * perPage)
                    .limit(perPage);
            }

            if (category) {
                products = await productModel
                    .find({ status: "List", category }).populate('brand')
                    .skip((page - 1) * perPage)
                    .limit(perPage);
            }


            res.render("user/products", {
                login: req.session.login,
                pageNum,
                page,
                products

            });

            if (req.session.userLogin) {
                res.render("user/products", { products, login: true });
            } else {
                res.render("user/products", { products, login: false });
            }

        } catch (err) {
            console.log(err);
            res.json("something wrong ");
        }

    },



    single: async (req, res) => {
        try {
            let id = req.params.id;
            console.log(req.params.id);
            let brand = await brandModel.find();
            let single = await productModel.findOne({ _id: id });
            let product = await productModel.findOne({ _id: id }).populate('brand');

            // res.render('user/single' ,{single,category});
            if (req.session.userLogin) {
                res.render("user/single", { single, product, brand, login: true });
            } else {
                res.render("user/single", { single, brand, product, login: false });
            }
        } catch (error) {
            console.log(error)
            res.redirect('/')
        }
    },

     search :async (req, res) => {
        const products = await productModel.find();
        res.render("user/search", { login: true, products });
      },

    profile: async (req, res) => {
        let userId = req.session.userId;
        let brand = await brandModel.find();
        let user = await userModel.findOne({ _id: userId });
        let address = await addressModel.findOne({ userId: userId })
        console.log(address)

        if (address) {

            let address3 = address.address;

            res.render("user/profile", {
                user,
                brand,
                address3,
                address,
                index: 1,
                login: true
            });


        } else {
            if (req.session.userLogin) {
                res.render("user/profile", { user, brand, address, login: true });
            } else {
                res.render("user/profile", { user, brand, address, login: false });
            }
        }
    },

    addAddressPage: async (req, res) => {
        let brand = await brandModel.find();
        if (req.session.userLogin) {
            res.render("user/address", { brand, login: true });
        } else {
            res.render("user/address", { brand, login: false });
        }

    },

    newAddress: async (req, res) => {
        const {
            fullName,
            houseName,
            city,
            state,
            pincode,
            phone
        } = req.body;
        let UserData = req.session.user;
        let userId = req.session.userId;

        let exist = await addressModel.findOne({ userId: userId })

        if (exist) {
            await addressModel.findOneAndUpdate({
                userId
            }, {
                $push: {
                    address: {
                        fullName,
                        houseName,
                        city,
                        state,
                        pincode,
                        phone
                    }
                }
            }).then(() => {
                console.log(" address added successfully");
                res.redirect("user/profile");
            })
        } else {
            const address = new addressModel({
                userId,
                address: [
                    {
                        fullName,
                        houseName,
                        city,
                        state,
                        pincode,
                        phone
                    }
                ]
            });

            await address.save().then(() => {
                console.log(" address added successfully");
                res.redirect("user/profile");
            }).catch((err) => {
                console.log(err.message);
                res.redirect("user/profile");
            });
        }

    },

    changeAddress: async (req, res) => {
        const addressId = req.params.id
        const currrentAdd = await profile.findOne({ 'address._Id': addressId })
        console.log(currrentAdd);
        res.render('user/checkout', { currrentAdd })


    },

    updateAddress: async (req, res) => {
        let userId = req.session.userId;
        let addIndex = req.params.id
        const profile = await addressModel.findOne({ userId: user })
        const addressId = profile.address[addIndex]._id
        const user = await userModel.findById(userId)
        let profiles = profile.address
        console.log(profiles);
        res.render('user/updateAddress', { profiles, user, addIndex, addressId })

    },


    // delete an address

    deleteAddress: async (req, res) => {
        let userId = req.session.userId;
        let addressId = req.params.id

        let address = await addressModel.findOneAndUpdate({
            userId: userId
        }, {
            $pull: {
                address: {
                    _id: addressId
                }
            }
        },).then(() => {
            res.redirect('/user/profile')
        })
    },


    cart: async (req, res) => {
        let userId = req.session.userId;
        let list = await cartModel.findOne({ user: userId }).populate("products.productId")
        console.log(list);
        if (list != null) {
            let cartProducts = list.products;
            let cartTotal = list.cartTotal
            let user = await userModel.findById(userId)
            let cart = await cartModel.findOne({ user: userId })
            let wishList = await wishlistModel.findOne({ user: user })
            const viewcart = await cartModel.findOne({ user: userId }).populate("products.productId").exec()
            if (wishList) {
                count = cart.products.length
            }

            console.log(cartProducts);
            if (req.session.userLogin) {
                res.render("user/cart", {
                    cartProducts,
                    index: 1,
                    login: true,
                    list,
                    cartTotal,
                    user,
                    wishList
                });
            } else {
                res.render("user/cart", {
                    cartProducts,
                    category,
                    index: 1,
                    login: false
                });
            }
        } else {
            res.redirect("/");
        }
    },


    addToCart: async (req, res) => {
        let productId = req.params.id;
        let userId = req.session.userId;
        let product = await productModel.findById(productId)
        let total = product.price

        console.log(total);

        const carts = await cartModel.findOne({ user: userId });

        if (!carts) {
            const newCart = new cartModel({ user: userId, cartTotal: total });
            await newCart.save().then(async () => {
                const cartProduct = await cartModel.findOneAndUpdate({
                    user: userId
                }, {
                    $push: {
                        products: [
                            {
                                productId,
                                total
                            }
                        ]
                    }
                });
                cartProduct.save().then(() => {
                    res.redirect("back")
                }).catch(() => {
                    console.log("Error in product saving");
                })
            }).catch(() => {
                console.log("Error in cart saving");
            })
        } else {
            const exist = await cartModel.findOne({ userId, 'products.productId': productId })
            if (exist != null) {
                await cartModel.findOneAndUpdate({ userId, 'products.productId': productId }, { $inc: { "products.$.quantity": 1, "products.$.total": total, cartTotal: total } })
            } else {

                const cartProduct = await cartModel.findOneAndUpdate({
                    user: userId
                }, {
                    $push: {
                        products: [
                            {
                                productId,
                                total
                            }
                        ]
                    },
                    $inc: {
                        cartTotal: total
                    }
                });
                cartProduct.save().then(() => {
                    res.redirect("back")
                }).catch(() => {
                    console.log("Error in product saving");
                })
            }
        }
    },

    incQuantity: async (req, res) => {
        const user = req.session.userId
        const productId = req.params.id
        // const price = req.params.price
        let product = await productModel.findById(productId);
        let price = product.price;
        await cartModel.findOneAndUpdate({
            user,
            'products.productId': productId
        }, {
            $inc: {
                'products.$.quantity': 1,
                'products.$.total': price,
                cartTotal: price

            }
        })
        res.redirect('/cart')
    },

    decQuantity: async (req, res) => {
        const user = req.session.userId
        const productId = req.params.id
        // const price = parseInt(req.params.price)
        let product = await productModel.findById(productId);
        let price = product.price;
        await productModel.findById(productId)
        await cartModel.findOneAndUpdate({
            user,
            'products.productId': productId
        }, {
            $inc: {
                'products.$.quantity': -1,
                'products.$.total': - price,
                cartTotal: - price
            }
        })
        res.redirect('/cart')
    },


    deleteCart: async (req, res) => {
        let userId = req.session.userId;
        let productId = req.params.id;
        const cart = await cartModel.findOne({ userId }).populate("products")
        const itemIndex = cart.products.findIndex(product => product.productId == productId);
        cart.products.splice(itemIndex, 1)
        cart.cartTotal = cart.products.reduce((acc, curr) => {
            return acc + curr.total;
        }, 0)
        cart.discount.percentage = 0
        cart.grandTotal = 0
        await cart.save().then(() => {
            res.redirect("/cart");
        }).catch(() => {
            console.log("Error");
        })
    },


    wishlist: async (req, res) => {
        let userId = req.session.userId;
        console.log(userId);
        let count = 0;
        let counts = 0;
        const wishlist = await wishlistModel.findOne({ user: userId })

        if (wishlist) {
            count = wishlist.products.length;
        }
        const User = await userModel.findById(userId)
        wishlistModel.findOne({ user: userId }).populate({
            path: "products",
            populate: {
                path: 'brand'
            }
        }).exec((err, data) => {
            if (err) {
                return console.log(err);

            }
            res.render("user/wishlist", {
                user: User,
                data,
                count,
                counts,
            });
        })

    },

    addtowishlist: async (req, res) => {
        const productId = req.params.id;
        let userId = req.session.userId;
        console.log(userId);
        const wishlist = await wishlistModel.findOne({ user: userId });
        console.log(">>>>>>>>>" + wishlist);
        if (wishlist) {
            await wishlistModel.findOneAndUpdate({ user: userId }, { $addToSet: { products: productId } })
        } else {
            const newWishList = new wishlistModel({
                user: userId,
                products: productId
            })
            await newWishList.save().then(() => {
                res.redirect("back");
            })
        }
        res.redirect("back");
    },

    deleteWishlist: async (req, res) => {
        let userId = req.session.userId;
        const productId = req.params.id;
        await wishlistModel.findOneAndUpdate({ userId }, { $pull: { products: productId } })
        res.redirect('back')


    },

    checkout: async (req, res) => {
        let userId = req.session.userId;
        let profile = await addressModel.findOne({ userId })
        const user = await userModel.findById({ _id: userId })
        const cart = await cartModel.findOne({ userId }).populate('products.productId').populate({ path: 'products.productId', populate: { path: 'brand' } })
        const discount = cart.discount.percentage
        const carts = cart.products
        console.log(carts);
        const cartTotal = cart.cartTotal
        const grandTotal = cartTotal - discount
        let addIndex = 0
        if (profile != null) {
            profile = profile.address
            num = profile.length - 1
             addIndex = req.body.indexs ? req.body.indexs : num
            console.log(addIndex,'defrtgyhu6789')
            res.render('user/checkout', {
                user,
                addIndex,
                profile,
                carts,
                cart,
                grandTotal,
                cartTotal,
                discount,
                index: 1
            })
        } else {
            res.render('user/checkout', { user, profile , addIndex})
        }


    },


    // verify payment

    verifyPayment: async (req, res) => {
        const userId = req.session.userId;
        const cart = await cartModel.findOne({ userId });
        const cartTotal = cart.cartTotal;
        const product = cart.products;
        console.log(product + "------proid");
        const details = req.body;
        const now = new Date()
        const deliveryDate = now.setDate(now.getDate() + 7)
        const addIndex = parseInt([1])
        let profile = await addressModel.findOne({ userId })
        profile = profile.address[addIndex]
        console.log(profile);
        console.log(details)

        const crypto = require("crypto");
        let hmac = crypto.createHmac("sha256", "MHq03BJw6Ya0xylomnUvIseA");
        hmac.update(details["Payment[razorpay_order_id]"] + "|" + details["Payment[razorpay_payment_id]"]);
        hmac = hmac.digest("hex");
        console.log(hmac);
        console.log(details["Payment[razorpay_signature]"]);

        if (hmac == details["Payment[razorpay_signature]"]) {
            console.log("order successfull");

            const newOrder = await orderModel.create({
                userId: userId,
                products: product,
                cartTotal: cartTotal,
                paymentMethod: "Razorpay",
                address: profile,
                paymentStatus: "paid",
                deliveryDate: deliveryDate

            })
            await newOrder.save().then(async (data) => {
                await cartModel.findByIdAndDelete({ _id: cart._id });
                res.json({ status: true, data });
            }).catch((err) => {
                res.json({ status: false, err })
            });
        } else {
            res.json({ status: false });
            console.log("payment failed");
        }


    },

    // apply coupon

    checkCoupon: async (req, res) => {
        let userId = req.session.userId;
        const couponCode = req.body.code;
        const currentDate = new Date();
        const couponAvail = await couponModel.findOne({ couponCode: couponCode })
        if (couponAvail != null) {
            const exist = await couponModel.findOne({
                couponCode: couponCode,
                users: userId
            })
            if (currentDate < couponAvail.expDate) {

                if (exist != null) {
                    res.json({ used: true })
                } else {
                    const coupon = couponAvail.discount
                    const cart = await cartModel.findOne({ user: userId })
                    const cartTotal = cart.cartTotal
                    const grandTotal = cartTotal - ((coupon / 100) * cartTotal).toFixed(0);
                    // console.log(grandTotal + ' ' + couponAvail._id + ' ' + discount);
                    await cartModel.findOneAndUpdate({
                        user: userId
                    }, {
                        $set: {
                            grandTotal,
                            'discount.percentage': coupon
                        }
                    })
                    res.json({ used: false })
                }
            } else {
                res.json({ expired: true })
            }



        } else {
            console.log("exist");
            res.json({ exist: true })

        }


    },


    // order Page

    orderPage: async (req, res) => {
        let sort = {
            date: -1
        }
        let userId = req.session.userId;
        const user = await userModel.findOne({ userId })
        const order = await orderModel.find({ userId }).populate('products.productId').sort(sort)
        console.log(order)
        let phone = user.Phone
        res.render('user/orderPage', { order, phone, moment, index: 1 })


    },

    addOrder: async (req, res, next) => {
        let userId = req.session.userId;
        let cart = await cartModel.findOne({ userId });
        const cartTotal = cart.cartTotal;
        const productId = cart.products;
        let addIndex = req.body.addIndex
        console.log(addIndex);
        let profile = await addressModel.findOne({ userId })
        profile = profile.address[addIndex]
        console.log(profile, 'asdfghjk');
        let cartId = cart._id.toString();
        const now = new Date()
        const deliveryDate = now.setDate(now.getDate() + 7)
        const paymentMethod = req.body.paymentType
        console.log(paymentMethod);

        if (paymentMethod === "cod") {
            const orderModels = await orderModel.create({
                userId: userId,
                products: productId,
                cartTotal: cartTotal,
                address: profile,
                paymentMethod: req.body.paymentType,
                paymentStatus: "Pending",
                deliveryDate: deliveryDate

            });
            orderModels.save()
                .then(async () => {
                    await cartModel.findByIdAndDelete({ _id: cart._id });
                    res.json({ status: true });
                })
        } else {
            console.log("Reached Online")
            var instance = new Razorpay({ key_id: "rzp_test_X3YzIfgkfukV1B", key_secret: "MHq03BJw6Ya0xylomnUvIseA" });

            instance.orders.create({
                amount: cartTotal * 100,
                currency: "INR",
                // reciept: "" +cartId

            }, function (err, order) {
                if (err) {
                    console.log(err);

                } else {
                    console.log(order)
                    res.json({ status: false, order })
                }
            });
        }


    },




    orderSuccess: async (req, res) => {
        let userId = req.session.userId;
        const orders = await orderModel.find({ userId }).populate('products.productId').sort({ _id: -1 }).limit(1)
        res.render('user/ordersuccess', { orders, index: 1 })


    },



    cancelOrder: async (req, res, next) => {
        const userId = req.session.userId
        const productId = req.params.id
        const orderId = req.params.orderId
        await orderModel.findOneAndUpdate({ _id: orderId, 'products._id': productId },
            {
                $set:
                    { 'products.$.orderStatus': "Cancelled" }
            })
        res.redirect("back")
    },


    sendOtp: async (req, res) => {
        fullname = req.body.FullName;
        username = req.body.UserName;
        email = req.body.Email;
        phone = req.body.Phone;
        password = req.body.Password;
        const user = await userModel.findOne({ Email: req.body.Email });

        // send mail with defined transport object
        if (!user) {

            var mailOptions = {
                to: req.body.Email,
                subject: "Otp for registration is: ",
                html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>" // html body
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

                res.render('user/otp');
            });
        } else {
            res.redirect('/login');
        }

    },

    resendOtp: (req, res) => {
        let mailOptions = {
            to: email,
            subject: "Otp for registration is: ",
            html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>" // html body
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            res.render('otp', { msg: "otp has been sent" });
        });


    },

    verify: (req, res) => {
        if (req.body.otp == otp) {

            const newUser = userModel({
                FullName: fullname,
                UserName: username,
                Email: email,
                Phone: phone,
                Password: password
            });
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.Password, salt, (err, hash) => {
                    if (err)
                        throw err;



                    newUser.Password = hash;
                    newUser.save().then(() => {

                        res.redirect("/login");
                    }).catch((err) => {
                        console.log(err);
                        res.redirect("/login")
                    })
                })
            })

        } else {
            res.render('user/otp', { msg: 'otp is incorrect' });
        }

    },

    // LOGIN

    signin: async (req, res) => {
        const banners = await BannerModel.find({ status: "List" })
        const products = await productModel.find().populate('brand').sort({ date: -1 }).limit(8)


        const { Email, Password } = req.body;
        const user = await userModel.findOne({
            $and: [
                {
                    Email: Email
                }, {
                    status: "Unblocked"
                }
            ]
        })
        if (!user) {
            return res.redirect('/login')
        }

        const isMatch = await bcrypt.compare(Password, user.Password);
        if (!isMatch) {
            return res.redirect('/login');
        }
        req.session.user = user.UserName
        req.session.userId = user._id
        req.session.userLogin = true;
        res.render('user/home', {
            login: true,
            banners,
            products,
            user: user.UserName
        });

    },

    logout: (req, res) => {
        req.session.loggedOut = true;
        req.session.destroy();
        res.redirect('/');
    },


    contact: (req, res) => {
        res.render("user/contact")
    },


}
