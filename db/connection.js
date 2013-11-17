
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

var Base = new Schema({
	screenW: String,
	screenH: String,
	ip: String,
	originalUrl: String,
	date: String,
	userAgent: String
});


db.Base = mongoose.model("Base",Base);
