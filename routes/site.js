/*
 * GET site page.
 */
var client = require("../utils/client");
var services = require("../services");
var site = exports = module.exports = {};

site.index = function(req, res) {
	client.sendPage(req, res, "site/index");
};
