var _ = require("underscore");

var options = exports = module.exports = {
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

_.extend(options, require('../config-local.js'));
