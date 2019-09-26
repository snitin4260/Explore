const sgMail = require('@sendgrid/mail')
// const { invitePeoples } = require('./helpers')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const invitePeoples = async (trip, userEmail, token) => {
  const msg = {
    to: `${userEmail}`,
    from: 'akshay85131@gmail.com',
    subject: 'Sending with Twilio SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: `<h1> To Join Trip </h1>
     <a href = "http://localhost:3000/join/${trip}?email=${userEmail}&key=${token}"> click Here...!</a>`
  }
  const result = await sgMail.send(msg)
  // res.json(200).send({ accInfo })
}

module.exports = invitePeoples
