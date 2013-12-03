/*
 * GET home page.
 */
var sys = exports = module.exports = {};
sys.login = function(req, res) {
	res.render('index', {
		type:"login",
		error:req.flash("error"),
		info:req.flash("info"),
		title: 'Easy Analytics Login'
	});
};
sys.signup = function(req, res) {
	res.render('index', {
		type:"signup",
		title: 'Sign up Easy Analytics'
	});
};