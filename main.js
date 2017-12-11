/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global __dirname */

var express = require("express");
var app = express();
var router = require("router");
var bodyParser = require('body-parser');
var session = require("express-session");
var mongoose = require("mongoose");

var passport = require("passport");
var localStrategy = require("passport-local");
var bcrypt = require('bcrypt');
var multer = require('multer');
var path = require("path");

var  passportLocalMongoose  = require("passport-local-mongoose");
var flash  = require("connect-flash");
var nodemailer = require("nodemailer");
var stripe = require('stripe')('sk_test_3NSpGN5XJ028yHcILU0ZXOpd');





var User = require("./models/users");
var Job = require("./models/job");
var Orders = require("./models/orders");
var Rating = require("./models/rating");







//settings
app.set("view engine", "ejs");

//used for forms and posting data
app.use(bodyParser.urlencoded({extended: true}));

//express-session
app.use(require("express-session")({
    secret: "musty",
    resave: false,
saveUninitialized: false
}));
app.use(flash());




//connect to mongoose


mongoose.connect(
"mongodb://mustymustafa:lovelY10@ds127506.mlab.com:27506/outsource"
);
mongoose.Promise = global.Promise;



//passport required 
 app.use(passport.initialize());
 app.use(passport.session());
 app.use(flash());
 passport.use(new localStrategy(User.authenticate()));
 
 passport.serializeUser(User.serializeUser());
 passport.deserializeUser(User.deserializeUser());
 
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
       res.locals.success = req.flash("success");
        res.locals.error = req.flash("error");
   next();
});








//requiring routes
        //render any external folders
app.use("/routes", express.static(__dirname + '/routes'));

app.use("/uploads", express.static(__dirname + '/uploads'));
app.use("/styles", express.static(__dirname + '/styles'));


var home = require("./routes/home.js");
var emp = require("./routes/employer");
//dashboard is for employer
 //dashboardE is for freelancer
var dash = require("./routes/dashboard");
var dashE = require("./routes/dashboardE");
var postjob = require("./routes/postjob");


//using routes
app.use("/", home);
app.use("/employer", emp);
app.use("/fldashboard", dash);
app.use("/dashboardE", dashE);
app.use("/postjob", postjob);



app.listen(process.env.PORT || 1231, () => {
   console.log("connected to server 3000");
});
