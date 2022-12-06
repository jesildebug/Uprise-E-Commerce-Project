const AdminModel = require("../models/adminModel");
const UserModel = require('../models/userModel');
const BrandModel = require('../models/brandModel');
const bannerModel = require("../models/banner");
const couponModel = require("../models/coupon")
const bcrypt = require("bcrypt");
const {signuppage} = require("./userController");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");


module.exports = {


    loginpage: (req, res) => {
        res.render("admin/signin")
    },

    homepage: (req, res) => {
        res.render("admin/adminhome")

    },


    // LOGIN

    adminlogin: async (req, res) => {
        const {Email, Password} = req.body;
        const admin = await AdminModel.findOne({Email});

        if (! admin) { // return res.redirect('/admin/signin')
        }

        const isMatch = await bcrypt.compare(Password, admin.Password);
        if (! isMatch) {
            return res.redirect('/admin/signin');
        }

        req.session.adminLogin = true;
        res.redirect('/admin/adminhome');
    },


   


    // view all user

    alluser: async (req, res) => {
        const users = await userModel.find({})
        res.render('admin/viewuser', {users, index: 1})
    },


    // Block and Unblock Users

    blockUser: async (req, res) => {
        const id = req.params.id
        await UserModel.findByIdAndUpdate({
            _id: id
        }, {
            $set: {
                status: "Blocked"
            }
        }).then(() => {
            res.redirect('/admin/alluser')
        })

    },

    unblockUser: async (req, res) => {
        const id = req.params.id
        await userModel.findByIdAndUpdate({
            _id: id
        }, {
            $set: {
                status: "Unblocked"
            }
        }).then(() => {
            res.redirect('/admin/alluser')
        })
    },


    // BRAND(CATEGORY)

    brand: async (req, res) => {
        const brand = await BrandModel.find({});
        res.render('admin/addbrand', {brand, index: 1})
    },


    // ADD NEW BRAND

    addbrand: (req, res) => {
        const brand = req.body.brand;
        const newBrand = BrandModel({brand});
        newBrand.save().then(res.redirect('/admin/brand'))


    },

    // DELETE  BRAND

    deletebrand: async (req, res) => {
        let id = req.params.id;
        // console.log("delete")
        await BrandModel.findByIdAndDelete({_id: id});
        res.redirect("back")
    },

    // Viewproducts

    viewproducts: async (req, res) => {
        const products = await productModel.find({}).populate('brand')
        res.render('admin/viewproducts', {products, index: 1})
    },


    // view all products

    productpage: async (req, res) => {
        let brand = await BrandModel.find();
        res.render('admin/addProducts', {brand})
    },

    // Add products with image

    addproducts: async (req, res) => {
        const {brand, model, description, price} = req.body;
        req.files.forEach(img => {});
        console.log(req.files);
        const productImages = req.files != null ? req.files.map((img) => img.filename) : null
        console.log(productImages);
        const newProduct = new productModel({
            brand,
            model,
            description,
            price,
            image: productImages
        });
        await newProduct.save().then(() => {
            console.log("Image has uploaded");
            res.redirect('/admin/viewproducts')
        }).catch((err) => {
            console.log(err.message);

        })
    },

    // soft delete

    // product list and unlist

    listProduct: async (req, res) => {
        const id = req.params.id
        await productModel.findByIdAndUpdate({
            _id: id
        }, {
            $set: {
                status: "List"
            }
        }).then(() => {
            res.redirect("/admin/viewproducts")
        })
    },
    deleteProduct: async (req, res) => {
        const id = req.params.id
        await productModel.findByIdAndUpdate({
            _id: id
        }, {
            $set: {
                status: "Unlist"
            }
        }).then(() => {
            res.redirect('/admin/viewproducts')
        })
    },

    // editproduct

    editproduct: async (req, res) => {
        let id = req.params.id
        let product = await productModel.findOne({_id: id}).populate('brand')
        let brand = await BrandModel.find()

        console.log(product)
        res.render('admin/editproducts', {brand, product})
    },

    // update products when edit

    updateproduct: async (req, res) => {
        const {
            brand,
            model,
            description,
            price,
            status
        } = req.body;
        console.log(req.body);

        if (req.file) {
            let image = req.file;
            await productModel.findByIdAndUpdate({
                _id: req.params.id
            }, {
                $set: {
                    image: image.filename
                }
            });
        }
        let details = await productModel.findByIdAndUpdate({
            _id: req.params.id
        }, {
            $set: {
                brand,
                model,
                description,
                price,
                status
            }
        });

        await details.save().then(() => {
            res.redirect('/admin/viewproducts')
        })
    },


    // Add banner

    addBannerpage: async (req, res) => {
        const banners = await bannerModel.find()
        console.log(banners)
        res.render('admin/addbanner', {banners, index: 1})

    },

    viewBannerpage: async (req, res) => {
        const banners = await bannerModel.find({})
        console.log(banners)
        res.render('admin/bannerview', {banners, index: 1})
    },

    addbanner: async (req, res) => {
        const {bannerName, description} = req.body;
        console.log(description);
        req.files.forEach(img => {});
        console.log(req.files);
        const bannerImages = req.files != null ? req.files.map((img) => img.filename) : null
        console.log(bannerImages);
        const newBanner = bannerModel({bannerName, description, image: bannerImages});
        await newBanner.save().then(() => {
            console.log("Image has uploaded");
            res.redirect('/admin/bannerview')
        }).catch((err) => {
            console.log(err.message);
            res.redirect("/admin/banner")

        })
    },

    listBanner: async (req, res) => {
        const id = req.params.id
        await bannerModel.findByIdAndUpdate({
            _id: id
        }, {
            $set: {
                status: 'List'
            }
        }).then(() => {
            res.redirect("/admin/bannerview")
        })

    },

    unlistBanner: async (req, res) => {
        const id = req.params.id
        await bannerModel.findByIdAndUpdate({
            _id: id
        }, {
            $set: {
                status: 'Unlist'
            }
        }).then(() => {
            res.redirect('/admin/bannerview')
        })

    },

    addCouponPage:async (req,res) =>{
        const coupons = await couponModel.find();
        res.render("admin/addcoupon",{ coupons,index: 1});

    },
    viewCoupon:async(req,res) => {
        const coupons = await couponModel.find();
        res.render("admin/couponview",{ coupons,index: 1} )
    },
    
    addcoupons:async(req,res) =>{
        const {couponCode, discount,maxLimit,minLimit,expDate}=req.body;
        const newCoupon = new couponModel({
            couponCode,
            discount,
            // limit,
            // created_date,
            // modified_date: null,
            maxLimit,
            minLimit,
            expDate
        });
        await newCoupon.save();
        res.redirect("/admin/couponview")

    },

    disable_coupon: async(req,res) =>{
        let couponId = req.params.id;
        const coupon = await couponModel
        .findOneAndUpdate({ _id: couponId}, {$set: { disable: true , upsert : true}} );
        await coupon.save().then((response)=> {
            res.redirect("back");
        });

    },

    enable_coupon: async (req,res) => {
        let couponId = req.params.id;
        await  couponModel
        .findOneAndUpdate({ _id: couponId},{ disable: false}, { upsert: true})
        .then((response) => {
            res.redirect("back");
        })
    },



}

