/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var express = require("express");
var router = express.Router();
var Job = require("../models/job");
var User = require("../models/users");
var middleware = require("../middleware/index");
var nodemailer = require("nodemailer");

nodemailer.createTestAccount((err, account) => {

    // create reusable transporter object using the default SMTP transport
    var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
    
        auth: {
            user: 'musty.mohammed1998@gmail.com', // generated ethereal user
            pass: 'musty100'  // generated ethereal password
        }
    });
    
    


 
router.get("/", middleware.isLoggedIn, function(req,res){
    //get all jobs from the db
res.render("postjob");   
});

router.post("/", function(req,res){
   var name = req.body.name;
   var description = req.body.description;
   var price = req.body.price;
   var start = req.body.start;
   var end = req.body.end;
   var category = req.body.category;
   var skills = req.body.skills;
   var status = req.body.status;
   
   //add freelancer id and username to the job added
   
   var freelancer = {
       id: req.user._id,
       username: req.user.username,
       email: req.user.email
   
       
   };
   
   
   
   var newJob = {name: name, description: description, price: price, freelancer: freelancer, category: category, started: start, ends: end, status, skills };
   //create a new job and save to DB
   Job.create(newJob, function(err,newlyCreated){
       if(err){
           console.log(err);
       } else {
     console.log("created");
           res.redirect("/fldashboard");
       }
   
   //find freelaner email(employee)

        User.find({}, function(err,found){
            
        
        var userEmail =[];
        found.forEach(function(found){
           userEmail.push(found.email);
        });
    
    
    
        console.log(userEmail);
           
        var mailOptions = {
        
        from: '"OutsourceNG" <musty.mohammed1998@gmail.com>', // sender address
        to: userEmail, // list of receivers
        subject: 'New Task Posted', // Subject line
        // text: "",
        html: '<b>A new Task has just been Posted by</b>' + '' + freelancer.username + "\n" + ' which might correspond with your category of skills.' + '\n'  + '<b>Name:</b>'+ name + '\n' + '<b>Description:</b>'  + description + '\n' + '<b>Price:</b>' + price + '\n'  + '<b>Start date:</b>'+ start + '\n'  + '<b>End Date:</b>'+  end + '\n' + '<b>Category:</b>'+ category + '\n' + '<b>Skills:</b>'+ skills + '<br>' + '<a href="http://localhost:3000/employer/5a0a35ca12355f2fe42b6489">View</a>' + '.'// html body
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
    });
    });
       
       
       
module.exports = router;