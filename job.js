/*  
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var mongoose = require("mongoose");


//creating jobs schema
var jobSchema = new mongoose.Schema({
    name: String,
    description: String,
    skills: String,
    price: String,
    category: String,
    started: String,
    ends: String,
    status: String,
      datePosted: {type: Date, default: Date.now} ,

        //to show the freelancer that posted the service
        freelancer: {
            id: { type: mongoose.Schema.Types.ObjectId,
            //ref User model
            ref: "User"},
            
            username: String,
            email: String,
            rating: Number
          
            
        }
        
      
        
        
        
});




//make a model
module.exports = mongoose.model("Job", jobSchema);
 