const router = require('express').Router();
const Room = require('../models/index').Room;
const User = require('../models/index').User;
const Meeting = require('../models/index').Meeting;
const r = require('../models/index').r
const moment = require('moment');
const mailer = require('../config/mail')
const constants = require('../config/constants')


//Search Rooms
function searchRooms(req, res) {

    var query = req.body;

    Room.filter({city_part: query.location})// Filter by City Part
        .filter(r.row("guests").gt(query.guests - 1)) //Filter by number of guests allowed
        .run().then(function (result) {

        var rooms = result;

        var searchedRooms = []
        var roomsWithDate = roomsWithSameDate(rooms, query);
        var roomsWithDay =  roomsWithSameDayOfWeek(rooms, query);

        searchedRooms = roomsWithDay.concat(roomsWithDate);

        res.status(200).send(JSON.stringify(searchedRooms))
    });

}


router.post('/search', function (req, res) {

    searchRooms(req, res);
});


//Create New Room
function createRoom(req, res) {

    var room = new Room(req.body.room);

    Room.save({
        name: room.name,
        company: room.company,
        address: room.address,
        floor: room.floor,
        entrance: room.entrance,
        city_part: room.city_part,
        guests: room.guests,
        wifi_name: room.wifi_name,
        wifi_pass: room.wifi_pass,
        description: room.description,
        image: room.image,
        logo: room.logo,
        contact_name: room.contact_name,
        email: room.email,
        phone: room.phone,
        slots: room.slots,
        booked: room.booked,
    }).then(function (result) {
        res.status(200).send(JSON.stringify(result))
    }).error(handleError(res));
};


router.post('/create', function (req, res) {
    createRoom(req, res);
});


// Book Room
function bookRoom(id, req, res) {

    var selectedSlots = req.body.selected;

    User.get(selectedSlots[0].user).run().then(function(user){


        Room.get(id).run().then(function (room) {

            //Create a new meeting
            var meeting = new Meeting({
                userId: user.id,
                roomId: room.id,
                roomName: room.name,
                roomCompany: room.company,
                date: selectedSlots[0].date,
                hoursFrom: selectedSlots[0].hour,
                hoursTo: parseInt(selectedSlots[selectedSlots.length-1].hour)+1
            });

            meeting.save().then(function(meeting) {

                console.log(meeting.id);
                //Add meeting id to selectedSlots
                for(var i = 0;i < selectedSlots.length; i++ ){
                    selectedSlots[i].meetingId = meeting.id;
                }
                console.log(selectedSlots);

                //Add selected slots to room
                if(room.booked == null || room.booked.length == 0) {
                    room.booked = selectedSlots
                } else {
                    room.booked = room.booked.concat(selectedSlots);
                }

                room.save().then(function (room) {

                    var mailData = {
                        date: moment(meeting.date).format("dddd, MMMM Do YYYY"),
                        from: meeting.hoursFrom,
                        to: meeting.hoursTo,
                        room: room.name,
                        address: room.address,
                        company: room.company,
                        roomId: room.id,
                        userName: user.firstName+" "+user.lastName,
                        roomEmail: room.email,
                        userEmail: user.email,
                        userId: user.id
                    }

                    //Email admin
                    mailer.sendMail(constants.ADMIN_EMAIL, constants.SYSTEM_NAME, "New Meeting", 'new_booking/admin_new_booking.html',mailData);
                    //Email room contact person
                    mailer.sendMail(room.email, room.contact_name, "Someone has reserved a meeting room", 'new_booking/contact_person_new_booking.html', mailData);
                    //Email User
                    mailer.sendMail(user.email,user.firstName+" "+user.lastName, "You booked a new meeting room", 'new_booking/user_new_booking.html', mailData);


                    res.status(200).send(JSON.stringify(room));

                }).error(handleError(res));

            }).error(handleError(res));

        }).error(handleError(res));


    }).error(handleError(res));


}

router.post('/book/:roomId', function (req, res) {
    bookRoom(req.params.roomId, req, res)
});


// Get One Room
function getRoom(id, res) {
    Room.get(id).then(function (result) {
        res.status(200).send(JSON.stringify(result))
    }).error(handleError(res));
}

router.get('/:roomId', function (req, res) {
    getRoom(req.params.roomId, res)
});


// Get All Rooms
function getRooms(res) {
    Room.run().then(function (result) {
        res.status(200).send(JSON.stringify(result))
    }).error(handleError(res));
}

router.get('/', function (req, res) {
    getRooms(res)
});


//Update Room Vacant Slots
function updateSlots(req, res) {

    var room = new Room(req.body.room);

    Room.get(room.id).update({
        slots: room.slots
    }).run().then(function (room) {
        res.status(200).send(JSON.stringify(room))
    }).error(handleError(res));
}

router.post('/slots', function (req, res) {
    updateSlots(req, res)
});


// Return the rooms that have slots with Date that match the query date
function roomsWithSameDate(rooms, query) {

    var queryDate = query.date;
    var queryMoment = moment(query.date).hour(query.from);;

    return rooms.filter(function (room) {
      var check = false;
        for (var i = 0; i < room.slots.length; i++) {
            if (room.slots[i].isDate && moment(room.slots[i].date).isSame(queryDate, 'day')) {

                var roomMomentFrom = moment(room.slots[i].date).hour(room.slots[i].hoursFrom)
                var roomMomentTo = moment(room.slots[i].date).hour(room.slots[i].hoursTo)

                if(queryMoment.isBetween(roomMomentFrom, roomMomentTo) || queryMoment.isSame(roomMomentFrom, 'hour')) {
                    check = true;
                }
            }
        }
        return check;
    })
}




// Return the rooms that have slots by dayOfWeek that match the query day of the week
function roomsWithSameDayOfWeek(rooms, query) {

    var queryDay = parseInt(moment(query.date).format("d"));
    var queryMoment = moment(query.date).hour(query.from);;


    return rooms.filter(function (room) {
        var check = false;
        for (var i = 0; i < room.slots.length; i++) {
            if (!room.slots[i].isDate && room.slots[i].day == queryDay) {

                var roomMomentFrom = moment(query.date).hour(room.slots[i].hoursFrom)
                var roomMomentTo = moment(query.date).hour(room.slots[i].hoursTo)

                if(queryMoment.isBetween(roomMomentFrom, roomMomentTo) || queryMoment.isSame(roomMomentFrom, 'hour')) {
                    check = true;
                }


            }
        }
        return check;
    })

}


//Handle Error
function handleError(res) {
    return function (error) {
        res.status(500).send({error: error.message})
    }
}


module.exports = router;


