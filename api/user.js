/**
 * Created by Benzo Media.
 * http://www.benzomedia.com
 * User: Oren Reuveni
 * Date: 17/05/2016
 * Time: 09:50
 */

const router = require('express').Router()
const mailer = require('../config/mail')

router.get('/', function(req,res) {
    if (req.isAuthenticated()) {
        res.json(req.user)
    }
    else
        res.json({})
})


router.post('/contact', function(req, res){
    var form = req.body;

   if(mailer.sendContact(form.email, form.name, form.subject, form.message)) {
       var result ={
           success: true
       }
       res.status(200).send(JSON.stringify(result))
   } else {
       var result ={
           success: false
       }
       res.status(200).send(JSON.stringify(result))
   }


})

module.exports = router
