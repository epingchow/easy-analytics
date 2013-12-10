/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var fs = require("fs");
var db = require("./db/connection");
var app = express();
var async = require("async");

var _ = require('underscore');
var services = require("./services");


var routes = require('./routes');
var user = require('./routes/user');
var sys = require('./routes/sys');
var flash = require('connect-flash');


var passport = require('passport'),
  QQStrategy = require('passport-qq').Strategy,
  LocalStrategy = require('passport-local').Strategy;


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
  oauth: {
    qq: {
      clientID: "",
      clientSecret: ""
    }
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
app.use(express.methodOverride());

var expressValidator = require('express-validator');

app.configure(function() {
  app.use(flash());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.cookieParser('your secret here'));
  app.use(express.bodyParser());
  app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
      var namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      };
    }
  }));
  app.use(express.session({
    secret: 'easy easy',
    cookie: {
      maxAge: 60000
    }
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});


configurePassport();


var User = {
  findOne: function(obj, callback) {
    callback(null, {
      id: "12345",
      validPassword: function(ps) {
        console.log(ps);
        return true;
      }
    })
  },
  findById: function(id, callback) {
    callback(null, {
      id: "12345",
      validPassword: function(ps) {
        console.log(ps);
        return true;
      }
    })
  }
}


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.get('/', routes.index);
app.get('/signup', sys.signup);
app.post('/signup', sys.doSignup);
app.get('/users', user.list);

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
  var Base = db.getModelWithKey("base", req.params.key);
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


// 配置 Passport

function configurePassport() {
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function(username, password, done) {
      services.getUserByEmail(username, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            message: '用户不存在'
          });
        }
        if (!user.validPassword(password)) {
          return done(null, false, {
            message: '密码不正确'
          });
        }
        //console.log(user);
        return done(null, user);
      });
    }
  ));

// QQ oauth 暂时没有可用的app key
  passport.use(new QQStrategy({
      clientID: options.oauth.qq.clientID,
      clientSecret: options.oauth.qq.clientSecret,
      callbackURL: "http://127.0.0.1:3000/auth/qq/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      //User.findOrCreate({ qqId: profile.id }, function (err, user) {
      return done(err, user);
      // });
    }
  ));

  app.get('/auth/qq',
    passport.authenticate('qq'),
    function(req, res) {
      // The request will be redirected to qq for authentication, so this
      // function will not be called.
    });

  app.get('/auth/qq/callback',
    passport.authenticate('qq', {
      failureRedirect: '/login'
    }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/');
    });
  // It's up to us to tell Passport how to store the current user in the session, and how to take
  // session data and get back a user object. We could store just an id in the session and go back
  // and forth to the complete user object via MySQL or MongoDB lookups, but since the user object
  // is small and changes rarely, we'll save a round trip to the database by storing the user
  // information directly in the session in JSON string format.

  passport.serializeUser(function(user, done) {
    done(null, JSON.stringify(user));
  });

  passport.deserializeUser(function(json, done) {
    var user = JSON.parse(json);
    if (user) {
      done(null, user);
    } else {
      done(new Error("Bad JSON string in session"), null);
    }
  });


  app.get('/logout', function(req, res) {
    req.logOut();
    res.redirect('/');
  });

  app.get('/login', sys.login);
  app.post('/login',
    passport.authenticate('local', {
      successRedirect: '/view/sproc/base',
      failureRedirect: '/login',
      badRequestMessage: "请输入正确的邮箱和密码",
      failureFlash: true
    }),
    function(req, res) {
      res.redirect('/view/sproc/base');
    });

  app.get('/view/*', function(req, res, next) {
    if (req.user) {
      next();
    } else {
      req.flash('info', '您必须登陆后才能访问该页面');
      res.redirect('/login');
    }
  });
}