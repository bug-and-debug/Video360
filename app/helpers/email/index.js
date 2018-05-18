const loadTemplate = require('./loadTemplate')
const config = require('../../config');
const templates = {
  verification: loadTemplate('verification'),
  resetpassword: loadTemplate('resetpassword')
}

const nodemailer = require('nodemailer')
const mailgunTransport = require('nodemailer-mailgun-transport')

const auth = {
  auth: {
    api_key: config.mailgun.key,
    domain: config.mailgun.domain
  }
}

const mailgun = nodemailer.createTransport(mailgunTransport(auth))

const sendMail = _data => {
  if (global.isTest) {
    return Promise.resolve()
  }
  let data = Object.assign({}, _data)
  if (data.template) {
    let template = templates[data.template.name]
    if (!template) {
      throw new Error(`Wrong template: ${data.template.name}`)
    }
    data.html = template(data.template.data)
    delete data.template
  }
  if (!data.from) {
    data.from = `EMPEROR TRADING <noreply@emperorion.com>`
  }
  return new Promise((resolve, reject) => {
    mailgun.sendMail(data, (err, info) => {
      if (err) {
        reject(err)
      } else {
        resolve(info)
      }
    })
  })
}

module.exports = {
  sendMail
}
