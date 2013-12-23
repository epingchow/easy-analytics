/*
 * GET base page.
 */
var client=require("../utils/client");
var fs = require("fs");
var _ = require("underscore");
var options = require("../utils/options");

var script = exports = module.exports = {};

var jstmpl = {};
jstmpl.analytics = _.template(fs.readFileSync(__dirname + '/../templates/analytics.tmpl', 'utf8'));

script.analytics = function(req, res) {
  var data = {
    key: req.query.key,
    url: options.url
  }
  if (!data.key) {
    res.send(400, "key is needed.");
  } else {
    client.sendJS(req, res, jstmpl.analytics(data));
  }
};
