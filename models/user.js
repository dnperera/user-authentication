var mongoose = require("mongoose");
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
	username: String,
	password: String,
	email:String
}); 

//add  passport Local Mongoose methods to User Schema;
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",UserSchema);