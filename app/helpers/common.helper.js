'use strict';

const shortid = require('short-id');
const nodemailer = require('nodemailer');
const {sendMail} = require('./email')

shortid.configure({
	length: 5
});

let generateShortId = function() {
	return shortid.generate();
};

let validateEmail = function(email) {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

let validatePassword = function(password) {
	if (password.length < 6)
		return false
	return true
}

const sendEmail =  async function(content) {
  try {
    let mailData = {
      to: content.recipient,
      subject: content.subject,
      template: {
        name: content.template,
        data: content.data
      }
    }

    return sendMail(mailData).then(_res => {
      return Promise.resolve()
    }).catch(_err => {
      console.log(_err)
      return Promise.reject(_err);
    })
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = {
	generateShortId,
	validateEmail,
	validatePassword,
	sendEmail
}
