'use strict';

const _ = require('lodash');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	email: mongoose.Schema.Types.String,
	password: mongoose.Schema.Types.String,
	username: mongoose.Schema.Types.String,
	verifyLink: mongoose.Schema.Types.String
}, {
	timestamps: true
});

UserSchema.methods.update = function(data) {
	let keys = Object.keys(data)
	keys.forEach(key => {
		this[key] = data[key]
	})
}

module.exports = mongoose.model('User', UserSchema);
module.exports.UserSchema = UserSchema;
