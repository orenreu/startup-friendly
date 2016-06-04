// jshint esversion: 6

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var app = express();
var login = require('./config/passport')
var room = require('./api/room');
var user = require('./api/user');
var meeting = require('./api/meeting');
var imageUpload = require('./api/image-upload');

require('./models');


app.use(express.static('./public'));
app.use('/scripts', express.static('./node_modules/'));
app.use('/node_modules', express.static('./node_modules/'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());





var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}

var isAdmin = function(req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin) {
        return next();
    }
    res.redirect('/login');
}

var isSameUser = function(req, res, next) {

    if(req.isAuthenticated()) {
        var reqUserId = req.params.user;
        var authUserId = req.user.id;

        if (reqUserId == authUserId) {
            return next();
        }
    }

    res.redirect('/login');
}








// Routes
app.use('/auth', login)
app.use('/api/room', room);
app.use('/api/image-upload', imageUpload);
app.use('/api/logo-upload', imageUpload);
app.use('/api/user', user);
app.use('/api/meeting', meeting);


// Serve index file for all known paths
function serveIndex(req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'))
}
app.get('/login', serveIndex)
app.get('/room', serveIndex)
app.get('/room/create', isAdmin, serveIndex)
app.get('/room/:roomId', serveIndex)
app.get('/slots/:roomId', isAdmin, serveIndex)
app.get('/meetings/:user',isSameUser, serveIndex)


app.listen(3000);
console.log('Listening on port 3000');




