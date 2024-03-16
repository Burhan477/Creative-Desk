import nodemailer from 'nodemailer'
import ejs from 'ejs'
import path from 'path'
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()
const mailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USER_MAIL,
    pass: process.env.PASSWORD,
  },
})
const sendMail = async (mailData: any, fileName: any, subject: any) => {
  const requiredPath = path.join(__dirname, `../..//src/view/${fileName}`)

  const data = await ejs.renderFile(requiredPath, mailData, subject)

  const mainOptions: any = {
    from: process.env.USER_MAIL,
    to: mailData.email,
    subject,
    html: data,
  }

  mailTransporter.sendMail(mainOptions, (err: any, info: { response: any }) => {
    if (err) console.error(err)
    else console.info(`Message sent: ${info.response}`)
  })
}

export default sendMail
