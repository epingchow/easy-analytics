/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var demo = require('./routes/demo');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var client = require('./utils/client');

var fs = require("fs");
var db = require("./db/connection");
var app = express();
var async = require("async");

var _ = require('underscore');
var services = require("./services");

var options = {
  // Should be unique to your site. Used to hash session identifiers
  // so they can't be easily hijacked
  db: {
    host: '127.0.0.1',
    port: 27017,
    name: 'easy-analytics'
  },
  http: {
    port: 3000
  },
  sessionSecret: 'easy-analycity',
  // In production you'd most likely drop the dev. and the port number for both of these
  url: 'http://127.0.0.1:3000'
};

var jstmpl = {};
jstmpl.analytics = _.template(fs.readFileSync(__dirname + '/templates/analytics.tmpl', 'utf8'));

_.extend(options, require('./config-local.js'));

// all environments
app.set('port', options.http.port || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.get('/', routes.index);
app.get('/users', user.list);
app.get('/demo', demo.test);


app.get('/analytics.js', function(req, res) {
  var data = {
    key: req.query.key,
    url: options.url
  }
  if (!data.key) {
    res.send(400, "key is needed.");
  } else {
    client.sendJS(req, res, jstmpl.analytics(data));
  }
});

app.get('/data/done', function(req, res) {
  //res.set("Content-type","application/javascript");
  res.send(200, "");
});

// 查看基本数据页面
app.get('/view/:key/base', function(req, res) {
  res.render("data/base", {
    title: "base",
    key: req.params.key
  });
});


// 查看基本数据明细页面
app.get('/view/:key/base/detail', function(req, res) {
  services.getBaseListCount(req.params.key, function(err, count) {
    var moment = require("moment");
    var Page = require("./utils/ui").Page;
    var page = new Page(req.query.no, req.query.size, count);
    services.getBaseList(req.params.key, page, function(err, list) {
      res.render("data/base-detail", {
        title: "base",
        key: req.params.key,
        list: list,
        page: page,
        count: count
      });
    });
  });
});

// base 统计数据rest api集合
app.get('/rest/:key/base', function(req, res) {
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
});

// base 数据收集 POST
app.post('/data/:key/base', function(req, res) {

  var r = require("ua-parser").parse(req.get("User-Agent"));
  var Base = db.getModel("base", req.params.key);
  new Base({
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
  }).save(function(err) {
    if (!err) {
      //res.set("Content-type", "application/javascript");
      res.send(200, "");
      //res.redirect(200,'/data/done');
    } else {
      throw err;
    }

  });
});

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});