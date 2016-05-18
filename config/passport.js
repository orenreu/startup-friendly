/**
 * Created by Benzo Media.
 * http://www.benzomedia.com
 * User: Oren Reuveni
 * Date: 16/05/2016
 * Time: 20:18
 */

const router = require('express').Router();
var User = require('../models').User
var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy;
var configAuth = require('./auth');



passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});

// =========================================================================
// FACEBOOK ================================================================
// =========================================================================
passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL,
        enableProof: true,
        profileFields: ['id', 'displayName', 'email', 'first_name', 'last_name', 'picture']
    },

    // facebook will send back the token and profile
    function (token, refreshToken, profile, done) {

        User.getAll(['facebook', profile.id], {index: 'provider_providerId'}).run().then(function (users) {
            if (users.length == 0) {
                // new user

                return User.save({
                    providerId: profile.id,
                    provider: 'facebook',
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    email: profile.emails[0].value,
                    photo: profile.photos[0].value
                })
            }
            else {
                return users[0]
            }
        }).then(user => done(null, {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            photo: user.photo
        })).catch(
            err => {
                done(err)
            }
        )

    }));


router.get('/facebook', passport.authenticate('facebook', {scope: ['email', 'public_profile']}))
router.get('/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router