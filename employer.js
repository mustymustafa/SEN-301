/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var express = require("express");
var router = express.Router();
var Jobs = require("../routes/postjob");
var Job = require("../models/job");

var middleware = require("../middleware/index");


router.get("/", middleware.isLoggedIn, function(req,res){

    //get all jobs from the db
       Job.find({}).sort({datePosted: -1}).exec(function(err,allJobs){
       
        if(err){
            console.log(err);
        } else {
             res.render("employer", {jobs: allJobs}); 
        }
    });
});




module.exports = router;