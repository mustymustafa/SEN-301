/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var express = require("express");
var router = express.Router();
var middleware = require("../middleware/index");
var Job = require("../models/job");
var User = require("../models/users");




//go to the freelancer dashboard
router.get("/", middleware.isLoggedIn, function(req,res){

   res.render("dashboardE", {user: req.user});
    });
  

module.exports = router;


