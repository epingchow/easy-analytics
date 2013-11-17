// These settings merge with 'options' in server.js. Copy this file to
// config-local.js. That file is ignored via .gitignore so that your private
// API keys don't wind up in github

module.exports = {
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