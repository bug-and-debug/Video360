var path = require('path');

var protocol = process.env.SITE_PROTOCOL || 'http';
var port = process.env.SITE_PORT || process.env.PORT || 3030;

module.exports = {

  protocol: protocol,
  port: port,
  host: protocol + '://' + (process.env.SITE_HOSTNAME || ('localhost:' + port)),

  webConcurrency: process.env.WEB_CONCURRENCY || require('os').cpus().length,

  apiPrefix: process.env.SURFACE_OWL_API_PREFIX || '', apiVersion: process.env.SURFACE_OWL_API_VERSION || '', logLevel: process.env.SITE_LOG_LEVEL || 'debug', // winston logging level

  clientAppPath: process.env.SITE_CLIENT_PATH || path.resolve(__dirname, '../../client/'),
  uploadPath: path.resolve(__dirname, '../../../../upload'),

  jwt: {
    secret: process.env.SITE_JWT_SECRET || 'SITEToken',
    expiresIn: 24 * 60 * 60, // 24 hours in seconds
    cookieName: process.env.SITE_JWT_COOKIE_NAME || 'yc_sss'
  },
  mailgun: {
    key: 'key-812f94f1312e01aca3dfa63bdd8abfd6',
    domain: 'mail.video360.com'
  }
};
