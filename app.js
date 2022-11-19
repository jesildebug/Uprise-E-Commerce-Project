const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const  logger =require('morgan')
const session = require('express-session')
const multer  = require('multer')
const mongoose = require('./configuration/connection');



const adminRoute = require("./routes/admin");
const userRoute = require("./routes/user");



const app = express()
// set view engine
app.set('views', path.join(__dirname, 'views'))
// or
// app.set('views',_dirname +'/views');
app.set('view engine', 'ejs');

// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.resolve(__dirname + '/public')));
app.use("/public", express.static('public'))

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())

//  app.use('/images',express.static(path.join(_dirname,'images')))

// session
const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret: 'secret-key',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: oneDay
    }
}))

// photo and other file upload using multer
const fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images/product_img");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + file.originalname);
    },
  });
  
  app.use(multer({ storage: fileStorage }).array("image", 5));

// CACHE  CONTROL
app.use((req, res, next) => {
    console.log('cache success')
    res.set("Cache-Control", "private,no-cache,no-store,must-revalidate");
    next();
})


// Admin route
app.use("/admin", adminRoute);



// user route
// const {error}=require('console');
app.use("/", userRoute);




// start server

app.listen(3500, () => {
    console.log('server started at port 3500')
})
