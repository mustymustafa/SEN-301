/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var mongoose = require("mongoose");

var ratingSchema = mongoose.Schema({
    rating: Number,
    fl: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        usermame: String
    }
    
    
});
module.exports = mongoose.model("Rating", ratingSchema);