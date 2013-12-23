/*
 * GET base page.
 */
var client = require("../utils/client");
var async = require("async");
var services = require("../services");
var base = exports = module.exports = {};

base.report = function(req, res) {
	client.sendPage(req, res, "data/base", {
		key: req.params.key
	});
};

base.detail = function(req, res) {
	services.getBaseListCount(req.params.key, function(err, count) {
		var moment = require("moment");
		var Page = require("../utils/ui").Page;
		var page = new Page(req.query.no, req.query.size, count);
		services.getBaseList(req.params.key, page, function(err, list) {
			client.sendPage(req, res, "data/base-detail", {
				key: req.params.key,
				list: list,
				page: page,
				count: count
			});
		});
	});
};

base.rest = function(req, res) {
	var data = {};
	async.series([
		function(cb) {
			services.getBrowserReport(req.params.key, function(err, results) {
				data.browsers = results;
				cb(err, results);
			});
		},
		function(cb) {
			services.getScreenReport(req.params.key, function(err, results) {
				data.screens = results;
				cb(err, results);
			});
		},
		function(cb) {
			services.getOSReport(req.params.key, function(err, results) {
				data.os = results;
				cb(err, results);
			});

		}
	], function(err, values) {
		res.set("Content-Type", "javascript/json");
		res.send(200, data);
	});
}

base.data = function(req, res) {
	var r = require("ua-parser").parse(req.get("User-Agent"));
	services.saveTo({
			key: req.params.key,
			model: "base",
			data: {
				screenW: req.body.screenW,
				host: req.body.hostname,
				screenH: req.body.screenH,
				ip: req.ip,
				browserVersion: r.ua.toVersionString(),
				browser: r.ua.family,
				os: r.os.family,
				device: r.device.family,
				href: req.body.href,
				path: req.body.path,
				date: new Date(),
				userAgent: req.get("User-Agent")
			}
		},
		function(err) {
			if (!err) {
				//res.set("Content-type", "application/javascript");
				res.send(200, "");
				//res.redirect(200,'/data/done');
			} else {
				throw err;
			}
		});
}