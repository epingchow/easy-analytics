/*
 // Base 服务类

*/

var _ = require("underscore");
var db = require("../db/connection");
var User = require("../models/user");
// content-utils.js
var services = exports = module.exports = {};

// 获取浏览器统计数据
services.getBrowserReport = function(key, callback) {
	var o = {};
	// map reduce方式
	o.map = function() {
		emit(this.browser, {
			browser: this.browser,
			version: this.browserVersion,
			count: 0,
			versions: {}
		});
	};
	o.reduce = function(id, values) {
		var v = {};
		var j = 0;
		values.forEach(function(val) {
			if (v[val.version] == undefined) {
				v[val.version] = 0;
			}
			v[val.version]++;
		});
		return {
			browser: id,
			count: values.length,
			versions: v
		};
	};

	db.getModelWithKey("base", key).mapReduce(o, function(err, results, stats) {
		callback(err, results);
	});
}


// 获取屏幕统计数据
services.getScreenReport = function(key, callback) {

	db.getModelWithKey("base", key).aggregate({
		$project: {
			screenW: 1,
			screenH: 1
		}
	}, {
		$group: {
			_id: {
				w: "$screenW",
				h: "$screenH"
			},
			count: {
				$sum: 1
			}
		}
	}, function(err, results, stats) {
		results.forEach(function(val) {
			val.screen = val._id.w + " x " + val._id.h;
		});
		callback(err, results);
	});
}

// 获取操作系统统计数据
services.getOSReport = function(key, callback) {
	db.getModelWithKey("base", key).aggregate({
		$project: {
			os: 1
		}
	}, {
		$group: {
			_id: "$os",
			count: {
				$sum: 1
			}
		}
	}, function(err, results, stats) {
		results.forEach(function(val) {
			val.os = val._id;
		});
		callback(err, results);
	});
}

services.getBaseListCount = function(key , callback){
	db.getModelWithKey("base", key).count({}, function(err, count) {
		callback(err,count);
  	});
}

services.getBaseList = function(key,page,callback){
	var query = db.getModelWithKey("base", key).find({}).sort("-date").skip(page.skip()).limit(page.pageSize);
    query.exec(function(err, list) {
      callback(err,list);
    });
}

services.getUserListCount = function(key , callback){
	db.getModel("user").count({}, function(err, count) {
		callback(err,count);
  	});
}

services.getUserList = function(key,page,callback){
	var query = db.getModel("user").find({}).skip(page.skip()).limit(page.pageSize);
    query.exec(function(err, list) {
      callback(err,list);
    });
}


services.getUserByEmail = function(email,callback){
	db.getModel("user").findByEmail(email,function(err,result){
		var user;
		if(result && result.length>0){
			user = new User(result[0]);
		}
		callback(err,user);
	});
}

services.getUserByName = function(name,callback){
	db.getModel("user").findByName(name,function(err,result){
		var user;
		if(result && result.length>0){
			user = new User(result[0]);
		}
		callback(err,user);
	});
}