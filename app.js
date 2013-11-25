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


app.get('/view/:key/base', function(req, res) {
  // db.getModel("base",req.params.key).find({},function(err,list){
  //   res.render("data/base",{
  //     title:"base",
  //     key:req.params.key,
  //     list:list,
  //     page:page,
  //     count:count
  //   });
  // });
  //var pagination=require("./utils/ui").pagination;
  db.getModel("base", req.params.key).count({}, function(err, count) {
    var moment = require("moment");
    var Page = require("./utils/ui").Page;
    var page = new Page(req.query.no, req.query.size, count);
    var query = db.getModel("base", req.params.key).find({}).sort("-date").skip(page.skip()).limit(page.pageSize);
    query.exec(function(err, list) {
      res.render("data/base", {
        title: "base",
        key: req.params.key,
        list: list,
        page: page,
        count: count
      });
    });
  });
});

app.get('/rest/:key/base', function(req, res) {
  var o = {};
  o.map = function() {
    emit(this.browser, {
      browser: this.browser,
      version: this.browserVersion
    });
  };
  o.reduce = function(id, values) {
    var v = {};
    var j = 0;
    values.forEach(function(val) {
      if (v[val.version] == undefined) {
        v[val.version] = 0;
      }
      v[val.version]++;
    });
    return {
      browser: id,
      count: values.length,
      versions: v
    };
  };


  var data = {};
  async.series([
    function(cb) {
      db.getModel("base", req.params.key).mapReduce(o, function(err, results, stats) {
        data.browsers=results;
        cb(err, results);
      });
    },
    function(cb) {
      db.getModel("base", req.params.key).aggregate({
        $project: {
          screenW: 1,
          screenH: 1
        }
      }, {
        $group: {
          _id: {
            w: "$screenW",
            h: "$screenH"
          },
          count: {
            $sum: 1
          }
        }
      }, function(err, results, stats) {
        results.forEach(function(val){
          val.screen=val._id.w+" x "+val._id.h;
        });
        data.screens=results;
        cb(err, results);
      });
    },
    function(cb) {
      db.getModel("base", req.params.key).aggregate({
        $project: {
          os:1
        }
      }, {
        $group: {
          _id: "$os",
          count: {
            $sum: 1
          }
        }
      }, function(err, results, stats) {
        results.forEach(function(val){
          val.os=val._id;
        });
        data.os=results;
        cb(err, results);
      });
    }
  ], function(err, values) {
    res.set("Content-Type", "javascript/json");
    res.send(200, data);
  })

});


app.post('/data/:key/base', function(req, res) {
  /*
  console.log('screenW ',req.body.screenW);
  console.log('screenH ',req.body.screenH);
  console.log('ip ',req.ip);
  console.log('host ',req.host);
  console.log('fresh ',req.fresh);
  console.log('stale ',req.stale);
  console.log('path ',req.body.path);
  console.log('Date ',new Date());
  console.log('User-Agent ',req.get("User-Agent"));
  */
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