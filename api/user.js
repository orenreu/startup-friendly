/**
 * Created by Benzo Media.
 * http://www.benzomedia.com
 * User: Oren Reuveni
 * Date: 17/05/2016
 * Time: 09:50
 */

const router = require('express').Router()

router.get('/', function(req,res) {
    if (req.isAuthenticated()) {
        res.json(req.user)
    }
    else
        res.json({})
})

module.exports = router
