/*
 * GET home page.
 */
var check= require('validator').check;
var db = require("../db/connection");
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
		error:req.flash("error"),
		info:req.flash("info"),
    validate:req.flash("validate"),
    user:req.flash("user"),
		title: 'Sign up Easy Analytics'
	});
};

sys.doSignup = function(req, res) {

  var user={
    name:req.body.name,
    email:req.body.email,
    password:req.body.password,
    passwordComfirm:req.body.passwordComfirm
  }

  req.assert('email', '邮箱是必填的').notEmpty();
  req.assert('email', '请输入正确的邮箱').isEmail();
  req.assert('name', '用户名是必填的').notEmpty();
  req.assert('password', '请输入密码').notEmpty();
  req.assert('password', '请输入6至20位的密码').len(6, 20);
  req.assert('passwordComfirm', '两次输入的密码不一样').equals(user.password);

  var errors = req.validationErrors();
  if (errors) {
    req.flash("validate",errors);
    req.flash("user",user);
    res.redirect('/signup');
    return;
  }

  //Validate user input
  // req.check('username', '请输入正确的用户名').len(0,64).isInt();
  // req.check('email', '请输入正确的邮箱').len(6,64).isEmail();
  //Sanitize user input
  var User = db.getModel("user", req.params.key);
  new User(user).save(function(err) {
    if (!err) {
      //res.set("Content-type", "application/javascript");
      //res.send(200, "");
      res.redirect(200,'/view/sproc/base');
    } else {
      throw err;
    }

  });
};