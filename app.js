// jshint esversion: 6

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();

var room = require('./api/room');
var imageUpload = require('./api/image-upload');

require('./models');


app.use(express.static('./public'));
app.use('/scripts', express.static('./node_modules/'));
app.use('/node_modules', express.static('./node_modules/'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


// Routes
app.use('/api/room', room);
app.use('/api/image-upload', imageUpload);


// Serve index file for all known paths
function serveIndex(req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'))
}
app.get('/room', serveIndex)
app.get('/room/create', serveIndex)
app.get('/slots/:roomId', serveIndex)


app.listen(3000);
console.log('Listening on port 3000');




