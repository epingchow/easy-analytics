/*
 * GET home page.
 */
var client=require("../utils/client");
exports.index = function(req, res) {
	client.sendPage(req,res,"index",{});
};