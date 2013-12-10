var _=require("underscore");

var User = exports = module.exports = function(user){
	_.extend(this,user);
};

User.prototype={
	validPassword:function(password){
		return this.password == password;
	}
}
