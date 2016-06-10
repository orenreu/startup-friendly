/**
 * Created by Benzo Media.
 * http://www.benzomedia.com
 * User: Oren Reuveni
 * Date: 27/05/2016
 * Time: 15:48
 */

var nodemailer = require("nodemailer");
var constants = require('./constants');
var fs = require('fs');


// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
    host: constants.SMTP_HOST,
    port: 465,
    secure: true, // use SSL
    auth: {
        user: constants.SYSTEM_EMAIL,
        pass: constants.SMTP_PASSWORD
    },
    tls: {
        rejectUnauthorized:false
    }
});



var mailer = {};

mailer.sendMail = function(email, name, subject, html, mailData) {


    var html = fs.readFileSync(__dirname+'/templates/'+html);

    var sendTemplateEmail = transporter.templateSender({
        subject: subject,
        html: html // html body
    }, {
        from: '"'+constants.SYSTEM_NAME+'"'+'<'+constants.SYSTEM_EMAIL+'>', // sender address
    });


    sendTemplateEmail({
        to: email
    }, mailData , function(err, info){
        if(err){
            console.log('Error');
        }else{
            console.log('Message sent: ' + info.response);
        }
    });

}



mailer.sendContact = function(email, name, subject, message) {


    var mailOptions = {
        from: '"Startup-Friendly" <hello@startup-friendly.com>', // sender address
        to: constants.ADMIN_EMAIL, // list of receivers
        subject: 'Someone contacted you via startup-friendly.com', // Subject line
        html: '<html>' +
        '<body style="text-align:center;">' +
        '<h2>Someone sent a message via startup-friendly.com</h2>' +
        '<br>' +
        '<p>Name: ' + name + '</p>' +
        '<p>Email: ' + email + '</p>' +
        '<p>Subject: ' + subject + '</p>' +
        '<p>Message: ' + message + '</p>' +
        '<br>' +
        '<br>' +
        '<p>Have a great day!</p>' +
        '</body>' +
        '</html>' // html body
    };

// send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error)
            return false;
        }
        return true;
    });
}

module.exports = mailer;