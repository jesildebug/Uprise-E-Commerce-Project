const { Router } = require('express');
const express = require('express');
const router =express.Router();
const auth=require('../middleware/authentication')


const controller = require('../controllers/adminController');




//GET METHOD
router.get('/signin',controller.loginpage)
router.get('/adminhome',controller.homepage)
router.get('/logout', controller.logout )

router.get('/alluser',auth.adminSession, controller.alluser)
router.get('/addProductpage',auth.adminSession, controller.productpage);
router.get('/brand',auth.adminSession,controller.brand);
router.get('/viewproducts',auth.adminSession,controller.viewproducts);



router.get("/addbanner",controller.addBannerpage);
router.get("/bannerview",controller.viewBannerpage);


router.get("/couponview",controller.viewCoupon);
router.get('/addcoupon',controller. addCouponPage);
router
    .route('/sales-report')
    .get(controller.salesReport)

   
   
 






//POST METHOD
router.post('/login',controller.adminlogin);

router.post("/unblockUser/:id",controller.unblockUser);
router.post("/blockUser/:id",controller.blockUser);

router.post('/addbrand' ,controller.addbrand);

router.post('/deletebrand/:id',auth.adminSession, controller.deletebrand)

router.post('/deleteProduct/:id',controller.deleteProduct);
router.post('/listProduct/:id',controller.listProduct)

router.post('/addproduct',controller.addproducts)

router.post('/updateproduct/:id',controller.updateproduct);
router.post('/editproducts/:id',controller.editproduct);

router.post('/addbanner',controller.addbanner);
router.post('/listBanner/:id',controller.listBanner);
router.post('/unlistBanner/:id',controller.unlistBanner);

router.post('/addcoupon',controller.addcoupons)
router.post('/disable/:id',controller.disable_coupon);
router.post('/enable/:id',controller.enable_coupon);

router 
  .route('/manageOrder')
  .get(controller. manageOrder);

router
  .route('/invoice/:id')
  .get( controller.invoice)

router
  .route('/changeStatus/:id/:prod/:status')
  .post(controller.changeOrderStatus)  

















module.exports=router