
var mongoose = require("mongoose");
// content-utils.js
var db = exports = module.exports = {};

mongoose.connect("mongodb://localhost/easy-analytics", function(err) {
	if (!err) {
		console.log("connected to mongodb");
	} else {
		throw err;
	}
});

var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var models={
	base: new Schema({
		screenW: String,
		screenH: String,
		host: String,
		ip: String,
		path: String,
		href:String,
		date: Date,
		os:String,
		device:String,
		browser:String,
		browserVersion:String,
		userAgent: String
	}),
	user: new Schema({
		name:{ type: [String], index: true },
		email:{ type: [String], index: true },
		password:String
	})
}

models.user.statics.findByName = function (name, cb) {
  this.find({ name: name }, cb);
}

models.user.statics.findByEmail = function (email, cb) {
  this.find({ email: email }, cb);
}


db.getModelWithKey = function(schema,key){
	return mongoose.model(schema+"_"+key,models[schema]);
}

db.getModel = function(schema){
	return mongoose.model(schema,models[schema]);
}

// db.close = function(){
// 	mongoose.disconnect();
// }

// db.connect = function(callback){
// }