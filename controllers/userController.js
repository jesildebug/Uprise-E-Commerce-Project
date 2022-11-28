const UserModel = require('../models/userModel');
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
const BrandModel = require('../models/brandModel');
const productModel = require("../models/productModel");
const cartModel = require("../models/cartModel");
const wishlistModel = require("../models/wishlistModel");
const userModel = require('../models/userModel');
const brandModel = require('../models/brandModel');
const addressModel = require('../models/addressModel');
// const orderModel = require("../../model/orderModel");
const {response} = require('express');
const { findOneAndUpdate } = require('../models/userModel');


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

    homepage: (req, res) => {
        if (req.session.userLogin) {
            res.render("user/home", {
                login: true,
                user: req.session.user
            });
        } else {
            res.render('user/home', {login: false});

        }


    },

    signuppage: (req, res) => {
        res.render("user/signup")
    },


    products: async (req, res) => {
        let products = await productModel.find().populate('brand');
        // let brand = await BrandModel.find();
        // res.render('user/products', {products, category})
        if (req.session.userLogin) {
            res.render("user/products", {products, login: true});
        } else {
            res.render("user/products", {products, login: false});
        }
    },


    single: async (req, res) => {
        let id = req.params.id;
        console.log(req.params.id);
        let brand = await BrandModel.find();
        let single = await productModel.findOne({_id: id});
        let product = await productModel.findOne({_id: id});

        // res.render('user/single' ,{single,category});
        if (req.session.userLogin) {
            res.render("user/single", {single, product, brand, login: true});
        } else {
            res.render("user/single", {single, brand, product, login: false});
        }
    },

    profile: async (req, res) => {
        let userId = req.session.userId;

        let brand = await brandModel.find();
        let user = await userModel.findOne({_id: userId});
        let address = await addressModel.findOne({userId: userId})
        console.log(user)


        if (address) {
            let address1 = address.address[0];
            let address2 = address.address[1];
            let address3 = address.address;
            if (req.session.userLogin) {
                res.render("user/profile", {
                    user,
                    brand,
                    address1,
                    address2,
                    address3,
                    address,
                    index: 1,
                    login: true
                });
            } else {
                res.render("user/profile", {
                    user,
                    brand,
                    address1,
                    address2,
                    address,
                    address3,
                    index: 1,
                    login: false
                });
            }

        } else {
            if (req.session.userLogin) {
                res.render("user/profile", {user, brand, address, login: true});
            } else {
                res.render("user/profile", {user, brand, address, login: false});
            }
        }
    },


    addAddressPage: async (req, res) => {
        let brand = await brandModel.find();
        if (req.session.userLogin) {
            res.render("user/address", {brand, login: true});
        } else {
            res.render("user/address", {brand, login: false});
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

        let exist = await addressModel.findOne({userId: userId})

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


    cart: async (req, res) => {
        let userId = req.session.userId;
        let list = await cartModel.findOne({user: userId}).populate("products.productId")
        console.log(list);
        if (list) {
            let cartProducts = list.products;
            let cartTotal = list.cartTotal
            console.log(cartProducts);

            // res.render('user/cart', {cartProducts,category, index:1})
            if (req.session.userLogin) {
                res.render("user/cart", {
                    cartProducts,
                    index: 1,
                    login: true,
                    list,
                    cartTotal
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
            res.render("user/cart");
        }
    },


    addToCart: async (req, res) => {
        let productId = req.params.id;
        let userId = req.session.userId;
        let product = await productModel.findById(productId)
        let total = product.price
        console.log(product);

        const carts = await cartModel.findOne({ user: userId });
        if (!carts) {
            const newCart = new cartModel({user: userId});
            await newCart.save()
                .then(async() => {
                    const cartProduct = await cartModel.findOneAndUpdate({user: userId}, {
                        $push: {
                            products: [{ productId, total }],
                        }});
                    cartProduct.save()
                    .then(()=>{
                        res.redirect("back")
                    })
                    .catch(() => {
                        console.log("Error in product saving");
                    })
                })
                .catch(() => {
                    console.log("Error in cart saving");
                })
        }else{
            const cartProduct = await cartModel.findOneAndUpdate({user: userId}, {
                $push: {
                    products: [{ productId, total }],
                }});
            cartProduct.save()
            .then(()=>{
                res.redirect("back")
            })
            .catch(() => {
                console.log("Error in product saving");
            })
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
                'products.$.total': price
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
                'products.$.total': -price
            }
        })
        res.redirect('/cart')
    },


    deleteCart: async (req, res) => {
        let userId = req.session.userId;
        let productId = req.params.id;
        console.log(productId);
        const cart = await cartModel.findOne({userId})
        const itemIndex = cart.products.findIndex(product => product.productId == productId);
        cart.products.splice(itemIndex, 1)
        cart.total = cart.products.reduce((acc, curr) => {
            return acc + curr.price;
        }, 0)
        await cart.save().then(() => {
            res.redirect("/cart");
        }).catch(() => {
            console.log("Error");
        })
    },


    // quantityIncrement: async (req, res) => {
    //     let userId = req.session.userId;
    //     console.log(userId)
    //     let productId = req.params.id;
    //     let product = await productModel.findById(productId)
    //     const cart = await cartModel.findOneAndUpdate({
    //         userId,
    //         'products.productId': productId
    //     }, {
    //         $inc: {
    //             "products.$.quantity": 1,
    //             "products.$.total": product.price,
    //             cartTotal: product.price
    //         }
    //     })

    //     res.redirect("back")
    // },

    // quantityDecrement: async (req, res) => {
    //     let userId = req.session.userId;
    //     console.log(userId)
    //     let productId = req.params.id;
    //     let product = await productModel.findById(productId)
    //     const cart = await cartModel.findOneAndUpdate({
    //         userId,
    //         'products.productId': productId
    //     }, {
    //         $inc: {
    //             "products.$.quantity": -1,
    //             "products.$.total": product.price * -1,
    //             cartTotal: product.price * -1
    //         }
    //     })

    //     res.redirect("back")
    // },


    wishlist: async (req, res) => {
        let userId = req.session.userId;
        console.log(userId);
        let count = 0;
        let counts = 0;
        const wishlist = await wishlistModel.findOne({user: userId});

        if (wishlist) {
            count = wishlist.products.length;
        }
        const User = await userModel.findById(userId)
        wishlistModel.findOne({user: userId}).populate("products").exec((err, data) => {
            if (err) {
                return console.log(err);

            }
            res.render("user/wishlist", {
                user: User,
                data,
                count,
                counts
            });
        })

    },

    addtowishlist: async (req, res) => {
        const productId = req.params.id;
        let userId = req.session.userId;
        console.log(userId);
        const wishlist = await wishlistModel.findOne({user: userId});
        console.log(">>>>>>>>>" + wishlist);
        if (! wishlist) {
            const newWishList = new wishlistModel({user: userId});
            await newWishList.save().then(() => {
                res.redirect("back")
            }).catch(() => {
                console.log("Error");
            })

        }

        const newWishList = await wishlistModel.findOneAndUpdate({
            user: userId
        }, {
            $push: {
                products: productId
            }
        });

        await newWishList.save().then(() => {
            res.redirect("back");
        }).catch(() => {
            console.log("Error")


        })


    },


    // orderSuccess: async (req, res) => {
    //     let address = req.body.addressId
    //     let paymentMethod = req.body.paymentMethod
    //     let userData = req.session.user;
    //     let userId = req.session.userId;
    //     let cart = await cartModel.findOne({userId})
    //     let total = cart.cartTotal
    //     let products = cart.products

    //     const newOrder = new orderModel ({
    //         userId,
    //         products,
    //         total,
    //         address,
    //         paymentMethod,
    //         orderStatus: "order placed"
    //     })

    //     newOrder.save()
    //     .then(async()=> {
    //         await cartModel.findByIdAndDelete({_id:cart._id})
    //         let orderId = newOrder._id
    //         let total =cartTotal
    //         console.log(paymentMethod);
    //         if (paymentMethod==='COD') {
    //             res.json({codesuccess:true})
    //         }else{

    //             return new Promise (async(resolve,reject)=>{
    //                 instance.orders.create({
    //                     amount:total * 100,
    //                     currency:"INR",
    //                     reciept:" " + orderId,

    //                 },function(err,order){
    //                     console.log("New order" , order)
    //                     resolve(order)
    //                 })
    //             }).then((response)=>{
    //                 res.json(response)
    //             })
    //         }

    //     })

    // },


    sendOtp: async (req, res) => {
        fullname = req.body.FullName;
        username = req.body.UserName;
        email = req.body.Email;
        phone = req.body.Phone;
        password = req.body.Password;
        const user = await UserModel.findOne({Email: req.body.Email});

        // send mail with defined transport object
        if (! user) {

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
            to: Email,
            subject: "Otp for registration is: ",
            html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>" // html body
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            res.render('otp', {msg: "otp has been sent"});
        });


    },

    verify: (req, res) => {
        if (req.body.otp == otp) {

            const newUser = UserModel({
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
            res.render('user/otp', {msg: 'otp is incorrect'});
        }

    },


    // signup: async (req, res) => {
    //     const newuser = userModel(req.body);
    //     console.log(req.body);
    //     bcrypt.genSalt(10, (err, salt) => {
    //         bcrypt.hash(newuser.Password, salt, (err, hash) => {
    //             if (err)
    //                 throw err;


    //             newuser.Password = hash;
    //             newuser.save().then(() => {
    //                 res.redirect("/login");

    //             }).catch((err) => {
    //                 console.log(err);
    //                 res.redirect("/login")

    //             })
    //         })
    //     })


    // },

    // LOGIN

    signin: async (req, res) => {
        const {Email, Password} = req.body;
        const user = await UserModel.findOne({
            $and: [
                {
                    Email: Email
                }, {
                    status: "Unblocked"
                }
            ]
        })
        if (! user) {
            return res.redirect('/login')
        }

        const isMatch = await bcrypt.compare(Password, user.Password);
        if (! isMatch) {
            return res.redirect('/login');
        }
        req.session.user = user.UserName
        req.session.userId = user._id
        req.session.userLogin = true;


        // const wish = await wishlistModel.findOne({ user: req.session.userId });
        //     if (!wish) {
        //         const newWishList = new wishlistModel({
        //             user: req.session.userId
        //         });
        //         await newWishList.save()
        //             .then(() => {

        //             })
        //             .catch(() => {
        //                 console.log("Error");
        //             })
        //         }
        res.render('user/home', {
            login: true,
            user: user.UserName
        });

    },

    logout: (req, res) => {
        req.session.loggedOut = true;
        req.session.destroy();
        res.redirect('/');
    }


}
