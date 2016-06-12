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

   mailer.sendContact(form.email, form.name, form.subject, form.message, function(err, result){
           if(err != null) {
               res.status(200).send(JSON.stringify({success: false}))
           } else {
               res.status(200).send(JSON.stringify({success: true}))
           }
       })

})

module.exports = router
