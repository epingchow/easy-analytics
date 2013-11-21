
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
	})
}


db.getModel = function(schema,key){
	return mongoose.model(schema+"_"+key,models[schema]);
}
