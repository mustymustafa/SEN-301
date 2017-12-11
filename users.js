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



var mongoose = require("mongoose");
var passportLocalMongoose   = require("passport-local-mongoose");


//creating mongoose Schema
var UserSchema = new mongoose.Schema({
   
   
   username: String,
   email: String,
   password:String,
   firstName: String,
   lastName: String,
   phone: String,
   country: String,
   // a fade in  form
   about: String,
   //selection input
   category: String,
   skills: String,
   links: String,
   
   
   
   secretWord: {type: String, default: null},

   
    //signup as a freelancer
   isFl: {type: Boolean, default: false},
       rating: {
           id: {
               type: mongoose.Schema.Types.ObjectId,
               ref: "Rating"
       },
       rating: Number
            }
   
});




UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("UserFl", UserSchema);
