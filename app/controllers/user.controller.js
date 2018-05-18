'use strict';

const express = require('express');
const router = express.Router();
const UserModel = require('../models/user.model');
const ErrorHelper = require('../helpers/error-helper');
const config = require('../config');
const utils = require('../helpers/common.helper')
const _ = require('lodash')
const randomize = require('randomatic');
const Cryptr = require('cryptr');

const cryptr = new Cryptr('video360-2018');

const index = async function(req, res) {
  try {
    let users = await UserModel.find().exec();
    res.send(users);
  }
  catch(err) {
    ErrorHelper.handleError(res, err, 400);
  }
};

const get = async function(req, res) {
  try {
    let user = await UserModel.findById(req.params.id).exec();
    if (user == null) throw new Error('USER_ID_NOT_FOUND');
    res.send(user);
  }
  catch(err) {
    ErrorHelper.handleError(res, err, 400);
  }
};

const create = async function(req, res) {
  console.log('create account');
  let { email, password, username } = req.body

  if (email === undefined)
    res.status(400).send({msg: 'email is required'})
  if (password === undefined)
    res.status(400).send({msg: 'password is required'})
  if (!utils.validateEmail(email))
    res.status(400).send({msg: 'invalid email'})
  if (!utils.validatePassword(password))
    res.status(400).send({msg: 'invalid password'})
    console.log('create user');

  try {
    let verifyLink = randomize('Aa0', 20)
    let user = await UserModel.findOne({email: email}).exec();
    if (user) { // user already exist
      console.log('user email already exist');
      res.status(400).send({msg: 'You already signed up with this email'});
    }
    user = await UserModel.findOne({username: username}).exec();
    if (user) {
      console.log('username already exist');
      res.status(400).send({msg: 'username already exist'});
    }

    console.log('user does not exist');
    user = new UserModel({
                              email: email,
                              password: cryptr.encrypt(password),
                              username: username,
                              verifyLink: verifyLink
                            });
    await user.save();
    user = await UserModel.findById(user._id, { password:0 });
    res.send(user);
  }
  catch(err) {
    ErrorHelper.handleError(res, err, 400);
  }
};

const update = async function(req, res) {
  try {
    let user = await UserModel.findById(req.params.id).exec();
    if (user == null) throw new Error('USER_ID_NOT_FOUND');
    user.update(req.body)
    await user.save();
    user = await UserModel.findById(req.params.id).exec();
    res.send(user);
  }
  catch(err) {
    ErrorHelper.handleError(res, err, 400);
  }
};

const destroy = async function(req, res) {
  try {
    await UserModel.deleteOne({_id: req.params.id});
    res.send(true);
  }
  catch(err) {
    ErrorHelper.handleError(res, err, 400);
  }
}

const verifyEmail = async function(req, res) {
  let verifyLink = req.params.link;
  let user = await UserModel.findOne({verifyLink: verifyLink}).exec()
  if (user == null) throw new Error('USER_ID_NOT_FOUND')
  user.verifyEmail();
  await user.save();
  res.send('ok');
}

const login = async function(req, res) {
  try {
    let { email, username, password } = req.body
    let params = {
      username: username,
      email: email,
      password: cryptr.encrypt(password)
    }

    params = _.pickBy(params, v => v !== undefined)
    let user = await UserModel.findOne(params, { password:0 }).exec();

    if(user == null) {
      res.status(400).send({msg: 'invalid username or password'})
    }
    res.send(user);
  }
  catch(err) {
    ErrorHelper.handleError(res, err, 400);
  }
};

// routes
router.get('/', index);
router.get('/:id', get);
router.get('/email/:link', verifyEmail);
router.post('/', create);
router.post('/login', login);
router.put('/:id',  update);
router.delete('/:id', destroy);

module.exports = router;
