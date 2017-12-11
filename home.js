
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var express = require("express");
var router = express.Router();

var User = require ("../models/users");
var passport = require("passport");
var nodemailer = require("nodemailer");
var Job = require("../models/job");
var middleware = require("../middleware/index");
var Orders = require("../models/orders");
var Ratings = require("../models/rating");
var starRatings = require('star-ratings');
var stripe = require("stripe")("sk_test_3NSpGN5XJ028yHcILU0ZXOpd");

  //setUp nodemailer
nodemailer.createTestAccount((err, account) => {

    // create reusable transporter object using the default SMTP transport
    var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
    
        auth: {
            user: 'musty.mohammed1998@gmail.com', // generated ethereal user
            pass: 'musty100'  // generated ethereal password
        }
    });

   


router.get("/", function(req,res){
   res.render("home");
   
});
//sign up route

router.get("/register", function(req, res){
res.render("registerFl", {user: req.user});
});
//sign up post request

router.post("/register", function(req,res){
   req.body.username;
   req.body.password;
   req.body.email;
   req.body.firstName;
   req.body.lastName;
   var phone = req.body.phone;
   var country = req.body.country;
   var about = req.body.about;
   var category = req.body.category;
   var skills = req.body.skills;
   var links = req.body.links;
   req.body.secretWord;
  


   //create new user and pass the password as a second arg because we want to hash the password
   //create new user and store username, password, secretword in DB
   var newUser =  new User({username: req.body.username, email: req.body.email, secretWord: req.body.secretWord,firstName: req.body.firstName,
   lastName: req.body.lastName, phone, country, about, category, skills, links });
   //check if user is a fl by using the secret word in DB, if secret word is not null, 
 if(req.body.secretWord ){
     newUser.isFl = true;
 }
  User.register(newUser,req.body.password, function(err,user){
       if(err){
     req.flash("error", err.message);
           return res.render("registerFl");
       }
       
     
       //log the user in using local strategy and store the info
       //if user is a fl then --> "/fldashboard" else --> "employer"
       
       passport.authenticate("local")(req, res, function(){
           req.flash("success", "welcome to outsourceNG" + user.username);
           if(req.body.secretWord){
              return res.redirect("/fldashboard");
           } else {
               return res.redirect("/employer");
           }
           
  
           
       });
       
        // setup email to send to req.body.body
    var mailOptions = {
        
        from: '"OutsourceNG" <musty.mohammed1998@gmail.com>', // sender address
        to: req.body.email, // list of receivers
        subject: 'Welcome to OutsourceNG”', // Subject line
        // text: "",
        html: '<b>You have successfully Signed up to OutsourceNg</b>' // html body
    };

                     // send mail with defined transport object
     smtpTransport.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        } else {
        console.log('Message sent: %s', info.messageId);
    }
    
    });
       });
   });



//sign in route
router.get("/login", function(req, res){
res.render("loginFl");
});

 //post sign in
 router.post("/login", function(req,res){
 req.body.username;
 req.body.password;
 req.body.secretWord;
 passport.authenticate("local")(req,res, function(err,user){
    if(err){
        req.flash("error", "incorrect usernamre or password");
        return res.render("loginFl");
    }
    if(req.body.secretWord){
        return res.redirect("/fldashboard");
    } else {
        return res.redirect("/dashboardE");
    }
 });
 
    
 });

router.get("/logout", function(req,res){
 req.logOut();
 req.flash("success", "logged you out!");
 res.redirect("/");
 
});

//show more info about one job
router.get("/employer/:id", function(req,res){
    //find the job with the provided id
    Job.findById(req.params.id, function(err, foundJob){
       if(err){
           console.log(err);
       } 
       
       Orders.find().sort({dateOrdered: -1}).where('id').equals(foundJob._id).exec(function(err,bids){
          if(err){
              req.flass("error", err.message);
              console.log(err);
          } 
          
          
           
       Ratings.find().where('fl.id').equals(req.user).exec(function(err,foundRating){
           if(err){
           console.log(err);
           } 
           var ratings = [];
       foundRating.forEach(function(rate){
           ratings.push(rate.rating);
     
       });
       var votes = starRatings(ratings);
         console.log(votes);
           
       
       
           //render show template
           res.render("show", {jobs: foundJob, bid: bids, votes});
       });
    });
    });
    });
    
    
    
    
    //go to the employer(freelancer) profile with the provided id
   router.get("/fldashboard/:id", function(req,res){
       
    //find the user with the provided id
    User.findById(req.params.id, function(err, foundUser){   
       if(err){
           console.log(err);
 
       }
       Job.find().where('freelancer.id').equals(foundUser._id).exec(function(err, displayJobs){
           if(err){
           console.log(err);
       }
       
           //render show template 
           console.log(displayJobs);
           res.render("profile", {user: foundUser, display: displayJobs});
    });
    
    });
    
    });
    
    
    
    
    
    
    
    
    
    
    
    //go to the user's profile with the provided id
   router.get("/Edashboard/:id", function(req,res){
       
    //find the user with the provided id
 User.findById(req.params.id, function(err, foundUser){   
       if(err){
           console.log(err);
 
       }
       //find the ratings of a particular user
       Ratings.find().where('fl.id').equals(foundUser._id).exec(function(err, foundRating){
           if(err){
           console.log(err);
       }
       
       var ratings = [];
       foundRating.forEach(function(rate){
           ratings.push(rate.rating);
     
       });
       var votes = starRatings(ratings);
         console.log(votes);
           
  
           //render show template 
          
           res.render("profileE", {user: foundUser, votes});
    });
    
    
     
       
   });
    
    });
    
    
    //ratings route
    router.post("/ratings", function(req,res){
        var rating = req.body.rating;
        
        var fl = {
           id: req.user._id,
           username: req.user.username
        };
        
        var rates = ({rating , fl});
        Ratings.create(rates, function(err,rate){
         if(err){
             console.log(err);
         }
        
         res.redirect("back");
            
       
        
        });
        
    });
    
    
    
  
    
    
    
    
    //bidding for service route
    router.get("/employer/:id/bid", function(req,res){
       
        //find the job's id
        //use order to get the freelancer info in ejs
        Job.findById(req.params.id,function(err, jobFound){
           if(err){
               console.log(err);
           } 
  
          
             
             
             
        });
           });
   
   
   
    
   router.post("/bid", function(req,res){
    //find fl id of the job you want to order
    var username = req.body.username;
    var price = req.body.price;
    var task = req.body.task;
    var id  = req.body.id;
    var info = req.body.info;
    var skills = req.body.skills;
    //get employer of the job's email
    var email = req.body.email;
    
    var fl = {
           id: req.user,
           username: req.user.username
        };
        
   
      

   //save freelancer's email to db
    var newOrder = {price,skills,email,task, info, username,id, fl};
   //create a new order 
   Orders.create(newOrder, function(err,newOrder){
       if(err){
           console.log(err);
       } 
                         // setup email to send to req.body.body
    var mailOptions = {
        
        from: '"OutsourceNG" <musty.mohammed1998@gmail.com>', // sender address
        to: email, // list of receivers
        subject: 'You have a new bidder”', // Subject line
        // text: "",
        html: username + " " +  '<b> just made a bid for</b>' + " " + task + " " + '<p>price:</p>' + " " + price + '<p>skills:</p>' + ' ' + skills    // html body
    };

                     // send mail with defined transport object
     smtpTransport.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        } else {
        console.log('Message sent: %s', info.messageId);
    }
    
    });
           console.log(newOrder);
           res.redirect("back");
         
           

    
   });
   
         
       });
       
       
       
       
     //charging a card
router.post('/charge', (req, res) => {
     const amount = 2500;        
        
        if(err){
            req.flash("error", "freelancer not found");
            res.redirect("back");
        }
        
        stripe.customers.create({

    email: req.body.stripeEmail,

    source: req.body.stripeToken

  })

  .then(customer => stripe.charges.create({

    amount,

    description: 'hire this freelancer',

    currency: 'usd',

    customer: customer.id

  }))

  .then(charge => {
      req.flash("success", "payment successful");
      
      res.redirect("back");
  });

 
   
});    
      

//about us page
router.get("/about", function(req,res){
   res.render("about"); 
});


//contact

router.get("/contact", function(req,res){
   res.render("contact"); 
});

router.post("/contact", function(req,res){
    var email = req.body.email;
    var message = req.body.message;
    var title = req.body.title;
    
                         // setup email to send to req.body.body
    var mailOptions = {
        
        from: '"OutsourceNG" <musty.mohammed1998@gmail.com>', // sender address
        to: 'mustapha.mohammed1@aun.edu.ng', // list of receivers
        subject: title, // Subject line
        // text: "",
        html: message  + ' ' + "<b>Sender</b>" + ' ' + email
    };

                     // send mail with defined transport object
     smtpTransport.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        } else {
        console.log('Message sent: %s', info.messageId);
    }
    
    });
          
           res.redirect("/");
         
});

});
       
    
    


 

  

  






       
       
           
     
      
        
        
    
module.exports = router;
