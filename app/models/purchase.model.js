'use strict';

const _ = require('lodash');
const mongoose = require('mongoose');

const PurchaseSchema = new mongoose.Schema({
	user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  view_ids: [{
		view_id: mongoose.Schema.Types.String,
		code: mongoose.Schema.Types.String
	}],
  code: mongoose.Schema.Types.String,
	type: mongoose.Schema.Types.String
}, {
	timestamps: true
});

PurchaseSchema.methods.update = function(data) {
	let keys = Object.keys(data)
	keys.forEach(key => {
		this[key] = data[key]
	})
}


module.exports = mongoose.model('Purchase', PurchaseSchema);
module.exports.PurchaseSchema = PurchaseSchema;
