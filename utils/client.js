var _=require("underscore");
// content-utils.js
var cu = exports = module.exports = {};

cu.sendJS=function(req,res,content){
	res.set('Content-Type', 'application/javascript');
	res.send(200, content);
}