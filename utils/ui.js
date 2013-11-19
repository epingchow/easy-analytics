var _ = require("underscore");

var fs = require("fs");

var ui = exports = module.exports = {};

var templates = {
	pagination: _.template(fs.readFileSync(__dirname + '/../templates/pagination.tmpl', 'utf8'))
}

var Page = function(pageNo, pageSize, count) {
	this.pageSize=parseInt(pageSize) || 25;
	this.count=parseInt(count);
	this.pageCount = parseInt(this.count / this.pageSize) + (count % this.pageSize > 0);
	this.pageNo= parseInt(pageNo) || 1;
	this.pageNo = Math.max(this.pageNo,1);
	this.pageNo = Math.min(this.pageNo,this.pageCount);
}
Page.prototype={
	skip:function(){
		return (this.pageNo - 1) * this.pageSize;
	},
	pagination:function(type){
		return templates.pagination(_.extend(this,{type:type}));
	}
}

ui.Page=Page;