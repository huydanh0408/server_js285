const nodemailer = require("nodemailer");
class process_call_sendMail {
    call_sendMail(from, to, subject, body) {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER, // User Gmail 
                pass: process.env.GMAIL_PWD // Pwd Gmail
            }
        });

        let mailOptions = {
            from: `Shop TT ${from}`,
            to: to,
            subject: subject,
            html: body
        };
        // Gọi phương thức sendMail -> trả về dạng promise
        return transporter.sendMail(mailOptions)
    }

}

var testCallMail = new process_call_sendMail();
module.exports = testCallMail