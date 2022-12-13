const express = require('express')
const router = express.Router()
const auth=require('../middleware/authentication')

const controller = require('../controllers/userController')
const { addOrder } = require('../middleware/authentication')
const { orderPage } = require('../controllers/userController')


// GET METHOD

router.get('/', controller.homepage)
router.get('/login', controller.loginpage)
router.get('/signuppage', controller.signuppage)
router.get('/logout', controller.logout )
router.get('/contact',controller.contact)


//product listing

router.get('/products',controller.products);
router.get('/single/:id',controller.userSession,controller.single);

// user profile address

router.get('/user/profile',controller.userSession,controller.profile)
router.get('/address',controller.addAddressPage)
router.get('/deleteAddress/:id', controller.userSession,controller.deleteAddress)

router
    .route('/updateAddress/:id')
    .get(auth.userSession, controller.updateAddress)
    // .post(auth.userSession, controller.updateUserAddress)







//cart

 router.get('/cart', auth.userSession, controller.cart);
 router.get('/cart/:id', controller.userSession, controller.addToCart)
 router.get('/user/deleteCart/:id',controller.userSession, controller.deleteCart)
 router.get("/user/button-increment/:id", controller.userSession,controller.incQuantity);
 router.get("/user/button-decrement/:id", controller.userSession,controller.decQuantity)



 
 //wishlist

 router.get('/wishlist',controller.userSession,controller.wishlist)

 router.get('/add-to-wishlist/:id', controller.userSession, controller.addtowishlist)
 router.post ('/deleteWishlist/:id',controller.userSession,controller.deleteWishlist)

 //checkout

 router.get('/checkout' ,controller.userSession, controller.checkout)

 router
   .route('/ordersuccess')
   .get(controller.userSession,controller.orderSuccess)



   router
    .route('/order')
    .post(auth.userSession,controller.addOrder)

    router
      .route('/orderPage')
      .get(auth.userSession,controller.orderPage)

    router
      .route('/cancelOrder/:id')  
      .post(auth.userSession,controller.cancelOrder)

  
    

// POST METHOD

// router.post('/signup', controller.signup);
router.post('/otp', controller.sendOtp);
router.post('/verify',controller.verify);
router.post('/signin',controller.signin);
router.post('/resendOtp',controller.resendOtp)


router.post('/newAddress', controller.newAddress)

router
    .route('/changeAddress')
    .post(controller.userSession,controller.checkout)


router
   .route('/verifypayment')
   .post(auth.userSession,controller.verifyPayment)

router
    .route('/coupon')
    .post(auth.userSession,controller.checkCoupon)

router
   .route('/cancelOrder/:id/:orderId')
   .post(auth.userSession,controller.cancelOrder)













module.exports = router
