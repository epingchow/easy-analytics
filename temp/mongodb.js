
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/easy-analytics", function(err) {
	if (!err) {
		console.log("connected to mongodb");

	} else {
		throw err;
	}
});

var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;
var Task = new Schema({
	task: String
});
var Task = mongoose.model("Task", Task);


app.get('/test', function(req,res){
	var task = new Task({task:"123"});
	task.save(function(err){
		if(!err){
			res.redirect("/demo");
		}else{
			throw err;
		}
	})
});