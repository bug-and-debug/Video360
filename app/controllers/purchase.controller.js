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

    let purchaseCode = randomize('0', 8);
    let viewIds = []
    view_ids.forEach(view_id => {
      viewIds.push({view_id: view_id, code: randomize('0', 8)})
    })

    let purchase = new PurchaseModel({user_id: user_id, view_ids: viewIds, type: type, code: purchaseCode});
    await purchase.save();
    res.send(purchase);
  }
  catch(err) {
    ErrorHelper.handleError(res, err, 400);
  }
};

const getViews = async function(req, res) {
  try {
    let { purchase_code } = req.body;
    if (purchase_code === undefined)
      res.status(400).send({msg: 'purchase_code is required'})

    let purchase = await PurchaseModel.findOneAndRemove({code: purchase_code}).exec(); // try bundle
    if (!purchase) {
      let purchases = await PurchaseModel.find().lean().exec();
      if (!purchases)
        res.status(400).send({msg: 'no purchase record'});

      let view_id = undefined
      let record_id = undefined
      purchases.forEach(record => {
        record['view_ids'].forEach(view => {
          if (view['code'] === purchase_code) {
            view_id = view['view_id']
            record_id = record['_id']
          }
        })
      })

      if (view_id === undefined) {
        res.status(400).send({msg: 'no purchase record'});
      } else {
        let selectedPurchase = await PurchaseModel.findById(record_id).exec();
        if (!selectedPurchase)
          res.status(400).send({msg: 'no purchase record'});
        let newViewIds = selectedPurchase['view_ids'].filter(v => v['view_id'] !== view_id).filter(val => !!val)

        selectedPurchase.update({view_ids: newViewIds})
        await selectedPurchase.save()

        res.send(view_id);
      }
    } else {
      let bundleViewIds = purchase['view_ids'].map(v => v['view_id'])
      if (bundleViewIds.length === 1)
        bundleViewIds = bundleViewIds[0]
      res.send(bundleViewIds);
    }
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
