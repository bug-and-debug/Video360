const UserModel = require('../models/user.model');
const ErrorHelper = require('../helpers/error-helper');

exports.user = function(req, res, next) {
	let userId = req.session.login_user_id;

	console.log(userId);

	if(userId == null || (typeof userId) == 'undefined') {
		req.user = null;
		next();
	}
	else {
		UserModel.findById(userId).then((user) => {
			req.user = user;
			console.log(req.user);
			next();
		}, (err) => {
			req.user = null;
			next();
		});
	}
};

exports.authorization = function(req, res, next) {
	try {
		if(req.user == null) {
			throw new Error('UNAUTHORIZED_ACCESS');
		}
		else {
			next();
		}
	}
  catch(err) {
    ErrorHelper.handleError(res, err, 401);
  }
};