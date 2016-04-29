// jshint esversion: 6


var config = require("./config.js");

// Import rethinkdbdash
//var thinky = require('thinky')(config.rethinkdb);
var thinky = require('thinky')(config.rethinkdb);
var r = thinky.r;
var type = thinky.type;


var Room = thinky.createModel("Room", {
    id: type.string(),
    name: type.string(),
    company: type.string(),
    address: type.string(),
    floor: type.string(),
    entrance: type.string(),
    city_part: type.string(),
    guests: type.number(),
    wifi_name: type.string(),
    wifi_pass: type.string(),
    description: type.string(),
    contact_name: type.string(),
    email: type.string(),
    phone: type.string(),
    slots: [type.object()],
    createdAt: type.date().default(r.now())
}); 

module.exports = {Room, r};