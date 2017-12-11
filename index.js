
var Job = require("../models/job");

//middleware to check if a user is logged in before acessing a page
var middlewareObj = {};
middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
    return next(); 
}
req.flash("error", "You need to be logged in to do that");
res.redirect("/login"); 
};


middlewareObj.delete = function(req,res,next){
  if(req.isAuthenticated()){
      Job.findById(req.params.id, function(err, found){
         if(err){
             res.redirect("back");
         } else {
             //does the user own the task?
             if(found.freelancer.id.equals(req.user.id)){
              next();   
             } else {
                 res.redirect("back");
             }
         }
      });
  }   else {
      res.redirect("back");
  }
};



module.exports = middlewareObj;
