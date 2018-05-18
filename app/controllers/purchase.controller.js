'use strict';

const express = require('express');
const router = express.Router();
const PurchaseModel = require('../models/purchase.model');
const UserModel = require('../models/user.model');
const ErrorHelper = require('../helpers/error-helper');
const config = require('../config');
const utils = require('../helpers/common.helper')
const _ = require('lodash')
const randomize = require('randomatic');

const index = async function(req, res) {
  try {
    let purchases = await PurchaseModel.find().exec();
    res.send(purchases);
  }
  catch(err) {
    ErrorHelper.handleError(res, err, 400);
  }
};

const get = async function(req, res) {
  try {
    let purchase = await PurchaseModel.findById(req.params.id).exec();
    if (purchase == null) throw new Error('PURCHASE_ID_NOT_FOUND');
    res.send(user);
  }
  catch(err) {
    ErrorHelper.handleError(res, err, 400);
  }
};

const create = async function(req, res) {
  console.log('create purchase');
  let { user_id, view_ids, type} = req.body

  if (user_id === undefined)
    res.status(400).send({msg: 'user_id is required'})
  if (view_ids === undefined || view_ids.length == 0)
    res.status(400).send({msg: 'view_ids is required and can not be empty'})
  if (type === undefined)
    res.status(400).send({msg: 'type is required'})
  console.log('create purchase');

  try {
    let user = await UserModel.findById(user_id);
    if (!user)
      res.status(400).send({msg: 'invalid user'});

    let purchaseCode = randomize('Aa0', 8);
    let purchase = new PurchaseModel(Object.assign(req.body, {code: purchaseCode}));
    await purchase.save();
    res.send(purchase);
  }
  catch(err) {
    ErrorHelper.handleError(res, err, 400);
  }
};

const getViews = async function(req, res) {
  try {
    let { user_id, purchase_code } = req.body;
    if (user_id === undefined)
      res.status(400).send({msg: 'user_id is required'})
    if (purchase_code === undefined)
      res.status(400).send({msg: 'purchase_code is required'})

    let purchase = await PurchaseModel.findOne({user_id: user_id, code: purchase_code}).exec();
    if (!purchase) {
      console.log('no purchase record')
      res.status(400).send({msg: 'no purchase record'});
    }

    res.send(purchase);
  } catch(err) {
    ErrorHelper.handleError(res, err, 400);
  }
}   

const destroy = async function(req, res) {
  try {
    await PurchaseModel.deleteOne({_id: req.params.id});
    res.send(true);
  }
  catch(err) {
    ErrorHelper.handleError(res, err, 400);
  }
}

// routes
router.get('/', index);
router.get('/:id', get);
router.post('/', create);
router.post('/views', getViews);
router.delete('/:id', destroy);

module.exports = router;
