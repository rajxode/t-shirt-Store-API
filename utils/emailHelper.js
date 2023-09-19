
// for sending mails

// nodemailer for sending mails
const nodemailer = require('nodemailer');


// function to send mails
const mailHelper = async (options) => {
    
    // creating transporter for sending mail
    const transporter = nodemailer.createTransport({
        // get these values from "mailtrap"
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS
        }
    });

    // message format to be send
    const message = {
        // sender 
        from: process.env.MAIL_SENDER, // sender address
        // receiver
        to: options.toMail, // list of receivers
        subject: options.subject, // Subject line
        text: options.message, // plain text body
    }

    // send mail with message
    await transporter.sendMail(message);
}


module.exports = mailHelper;