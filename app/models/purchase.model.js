'use strict';

const _ = require('lodash');
const mongoose = require('mongoose');

const PurchaseSchema = new mongoose.Schema({
	user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  view_ids: [mongoose.Schema.Types.String],
  code: mongoose.Schema.Types.String,
	type: mongoose.Schema.Types.String
}, {
	timestamps: true
});

module.exports = mongoose.model('Purchase', PurchaseSchema);
module.exports.PurchaseSchema = PurchaseSchema;
