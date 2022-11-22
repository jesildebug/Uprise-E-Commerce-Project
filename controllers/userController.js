const UserModel = require('../models/userModel');
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
const BrandModel = require('../models/brandModel');
const productModel = require("../models/productModel");
const cartModel = require("../models/cartModel");
const wishlistModel =require("../models/wishlistModel");
const userModel = require('../models/userModel');


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


    cart: async (req, res) => {
        let userId = req.session.userId;
        let list = await cartModel.findOne({user: userId}).populate("products.productId")
        console.log(list);
        if (list) {
            let cartProducts = list.products;
            console.log(cartProducts);

            // res.render('user/cart', {cartProducts,category, index:1})
            if (req.session.userLogin) {
                res.render("user/cart", {
                    cartProducts,
                    index: 1,
                    login: true,
                    list
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
        console.log(req.params.id);

        let productId = req.params.id;
        let userId = req.session.userId;
        // let quantity = req.params.quantity;
        console.log(userId);
        let product = await productModel.findById(productId)
        console.log(product);
        let total = product.price 
        let cartExist = await cartModel.findOne({user: userId});
        console.log(cartExist);

        if (cartExist) {
            const productExist = await cartModel.findOne({user: userId, "products.productId": productId})

            if (productExist != null) {
                await cartModel.findOneAndUpdate({
                    user: userId,
                    "products.productId": productId
                }, {
                    $inc: {
                        "products.$.quantity": 1,
                        "products.$.total": total,
                        cartTotal: total
                    }
                }).then(() => {
                    console.log(" product added to cart successfully");
                    res.redirect("/products");
                });
            } else {
                await cartModel.findOneAndUpdate({
                    user: userId
                }, {
                    $push: {
                        products: {
                            productId,
                            total
                        }
                    },
                    $inc: {
                        cartTotal: total
                    }
                }).then(() => {
                    console.log(" product added to cart successfully");
                    res.redirect("/products");
                });
            }
        } else {
            const cartProduct = new cartModel({
                user: userId,
                products: [
                    {
                        productId,
                        total
                    }
                ],
                cartTotal: total
            });
            await cartProduct.save().then(() => {
                console.log(" product added to cart successfully");
                res.redirect("/products");
            }).catch((err) => {
                console.log(err.message);
                res.redirect("/products");
            });
        }
    },


incQuantity:async(req,res,next)=>{
    const user = req.userId
    const productId=req.params.id
    const price=req.params.price
    await cartModel.findOneAndUpdate({ user,'products': productId},{$inc:{'products.$quanity':1,'products.$.total':price }})
    res.redirect('/cart')
},




 wishlist: async (req,res) => {
    let userId = req.session.userId;
   console.log(userId);
   let  count =0;
   let counts=0;
   const wishlist = await wishlistModel.findOne({user:userId});

   if (wishlist) {
    count=wishlist.products.length;
   }
   const User = await userModel.findById(userId)
    wishlistModel.findOne({user:userId}).populate("products").exec((err,data) => {
      if(err){
        return console.log(err);

      }
      res.render("user/wishlist",{
           user: User,
           data,
           count,
           counts,
      });
   })

   },

    addtowishlist : async(req,res) => {
    const productId = req.params.id;
    let userId = req.session.userId;
    console.log(userId);
    const wishlist =await wishlistModel.findOne({user: userId});
    console.log(">>>>>>>>>"+wishlist);
    if(!wishlist) {
        const newWishList = new wishlistModel({
            user:userId
        
        });
        await newWishList.save()
         .then(()=>{
            res.redirect("back")
        })
        .catch(()=>{
            console.log("Error");
        })

    }

    const newWishList = await wishlistModel.findOneAndUpdate({
        user:userId
    },{
        $push: {
            products:productId,
        }
    }
    );

    await newWishList.save()
         .then(() => {
            res.redirect("back");
         })

         .catch(() => {
            console.log("Error")


         })


   },

   

    








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
        const wish = await wishlistModel.findOne({ user: req.session.userId });
        if (!wish) {
            const newWishList = new wishlistModel({
                user: req.session.userId
            });
            await newWishList.save()
                .then(() => {
                    
                })
                .catch(() => {
                    console.log("Error");
                })
            }
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
