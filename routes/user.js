const express = require('express')
const router = express.Router()


const controller = require('../controllers/userController')


// GET METHOD

router.get('/', controller.homepage)
router.get('/login', controller.loginpage)
router.get('/signuppage', controller.signuppage)
router.get('/logout', controller.logout )


//product listing

router.get('/products',controller.userSession,controller.products);
router.get('/single/:id',controller.userSession,controller.single);


// POST METHOD

// router.post('/signup', controller.signup);
router.post('/otp', controller.sendOtp);
router.post('/verify',controller.verify);
router.post('/signin',controller.signin);
router.post('/resendOtp',controller.resendOtp)






module.exports = router
