const { Router } = require('express');
const express = require('express');
const router =express.Router();


const controller = require('../controllers/adminController');




//GET METHOD
router.get('/signin',controller.loginpage)
router.get('/adminhome',controller.homepage)

router.get('/alluser', controller.alluser)
router.get('/addProductpage', controller.productpage);
router.get('/brand',controller.brand);
router.get('/viewproducts',controller.viewproducts);



router.get("/addbanner",controller.addBannerpage);
router.get("/bannerview",controller.viewBannerpage);






//POST METHOD
router.post('/login',controller.adminlogin);

router.post("/unblockUser/:id",controller.unblockUser);
router.post("/blockUser/:id",controller.blockUser);

router.post('/addbrand' ,controller.addbrand);

router.post('/deletebrand/:id', controller.deletebrand)

router.post('/deleteProduct/:id',controller.deleteProduct);
router.post('/listProduct/:id',controller.listProduct)

router.post('/addproduct',controller.addproducts)

router.post('/updateproduct/:id',controller.updateproduct);
router.post('/editproducts/:id',controller.editproduct);
router.post('/addbanner',controller.addbanner)










module.exports=router