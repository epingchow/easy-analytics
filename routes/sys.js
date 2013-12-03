/*
 * GET home page.
 */
var sys = exports = module.exports = {};
sys.login = function(req, res) {
	res.render('login', {
		error:req.flash("error"),
		info:req.flash("info"),
		title: 'Easy Analytics Login'
	});
};