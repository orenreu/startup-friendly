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
    image: type.string(),
    logo: type.string(),
    contact_name: type.string(),
    email: type.string(),
    phone: type.string(),
    slots: type.array().schema(type.object().schema({
        date: type.date(),
        day: type.number(),
        hoursFrom: type.number(),
        hoursTo: type.number(),
        hoursSlots: type.array().schema(type.object().schema({
            hour: type.number()
        })),
        isDate: type.boolean()
    })),
    booked: type.array().schema(type.object().schema({
            date: type.date(),
            hour: type.number(),
            user: type.string(),
            username: type.string(),
            meetingId: type.string()
        })
    ),
    createdAt: type.date().default(r.now())
});


var User = thinky.createModel('User', {
    id: type.string(),
    providerId: type.string(),
    provider: type.string(),
    firstName: type.string(),
    lastName: type.string(),
    email: type.string(),
    photo: type.string(),
    isAdmin: type.boolean()
})

User.ensureIndex('provider_providerId', function (doc) {
    return [doc('provider'), doc('providerId')]
})



var Meeting = thinky.createModel('Meeting', {
    id: type.string(),
    userId: type.string(),
    roomId: type.string(),
    roomName: type.string(),
    roomCompany: type.string(),
    date: type.date(),
    hoursFrom: type.number(),
    hoursTo: type.number()
});


User.hasMany(Meeting, "meetings", "id", "userId");
Meeting.belongsTo(User, "user", "userId", "id");

Room.hasMany(Meeting, "meetings", "id", "roomId");
Meeting.belongsTo(Room, "room", "roomId", "id");




module.exports = {Room: Room, User: User, Meeting: Meeting, r: r};