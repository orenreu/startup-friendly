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

module.exports = mailer;