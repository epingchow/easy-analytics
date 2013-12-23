var _ = require("underscore");
// content-utils.js
var cu = exports = module.exports = {};

cu.sendJS = function(req, res, content) {
	res.set('Content-Type', 'application/javascript');
	res.send(200, content);
}

cu.sendPage = function(req, res, tmplPath, data) {
	var slots = {
		'user': req.user,
		'session': req.session,
		'title':'Easy Analytics'
	};
	data = data || {};
	_.defaults(data, {
		_:_,
		slots: slots
	});
	res.render(tmplPath, data);
}