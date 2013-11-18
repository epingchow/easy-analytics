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

var fs=require("fs");
var db = require("./db/connection");
var app = express();


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
  url: 'http://127.0.0.1:3000',
  // Used to check for the same host and redirect (canonicalize) if needed
  host: '127.0.0.1:3000'
};

var jstmpl={};
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


app.get('/analytics.js',function(req,res){
  var data={
    key: req.query.key,
    url: options.url
  }
  if(!data.key){
    res.send(400,"key is needed.");
  }else{
    client.sendJS(req,res,jstmpl.analytics(data));
  }
});

app.get('/data/done',function(req,res){
  res.set("Content-type","application/javascript");
  res.send(200,"");
});


app.get('/view/:key/base',function(req,res){
  var moment = require("moment");
  db.getModel("base",req.params.key).find({},function(err,list){
    res.render("data/base",{
      title:"base",
      key:req.params.key,
      list:list
    });
  })
});

app.post('/data/:key/base',function(req,res){
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
  var Base = db.getModel("base",req.params.key);
  new Base({
     screenW:req.body.screenW,
     host:req.host,
     screenH:req.body.screenH,
     ip:req.ip,
     path:req.body.path,
     date:new Date(),
     userAgent:req.get("User-Agent")
  }).save(function(err){
    if(!err){
      res.set("Content-type","application/javascript");
      res.send(200,"");
      //res.redirect(200,'/data/done');
    }else{
      throw err;
    }
  });
});

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});