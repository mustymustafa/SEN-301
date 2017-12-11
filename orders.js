/*  
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var mongoose = require("mongoose");


//creating jobs schema
var orderSchema = new mongoose.Schema({
   
    //freelancer's email and date ordered
    email: String,
    name: String,
    id: String,
    info: String,
    username:String,
    task: String,
    price: String,
    skills: String,
    dateOrdered: {type: Date, default: Date.now} ,
        
   fl: {
            id: { type: mongoose.Schema.Types.ObjectId,
            //ref User model
            ref: "User"},
            
            username: String
            
          
            
        }
        
      
        
});




//make a model
module.exports = mongoose.model("Orders", orderSchema);
 