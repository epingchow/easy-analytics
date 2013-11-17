/*
 * GET home page.
 */

exports.test = function(req, res) {
	// var fs = require('fs'),
	// 	data = "Some data";
	// fs.writeFile("file.txt", data, function(err) {
	// 	if (!err) {
	// 		console.log("wrote");
	// 	} else {
	// 		throw err;
	// 	}
	// })




	res.render('demo', {
		title: 'asdfasdfasdfasdf'
	});
};