
/*
 * GET users listing.
 */

var services = require("../services");

exports.list = function(req, res){
  services.getUserListCount(req.params.key, function(err, count) {
    var moment = require("moment");
    var Page = require("../utils/ui").Page;
    var page = new Page(req.query.no, req.query.size, count);
    services.getUserList(req.params.key, page, function(err, list) {
      res.render("sys/users", {
        title: "users",
        key: req.params.key,
        list: list,
        page: page,
        count: count
      });
    });
  });
};