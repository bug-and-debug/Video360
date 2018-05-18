const path = require('path');

module.exports = function (app) {
  app.use('/api/v1/user', require('../controllers/user.controller'));
  app.use('/api/v1/purchase', require('../controllers/purchase.controller'));
	app.use('/verify/', require('../controllers/user.controller'));
  app.all('*', function (req, res, next) {
    res.sendFile(path.resolve('public/index.html'));
	});
};
