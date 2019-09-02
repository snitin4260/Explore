const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const mail = (data) => {
  const msg = {
    to: 'akshay135781@gmail.com',
    from: 'akshay85131@gmail.com',
    subject: 'Sending with Twilio SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>'
  }
  sgMail.send(msg)
}

module.exports = mail
