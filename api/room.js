const router = require('express').Router();
const Room = require('../models/index').Room;



function saveRoom(req, res) {

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
        slots: room.slots
    }).then(function(result) {
        res.send(JSON.stringify(result));
    }).error(handleError(res));
};


router.post('/create', function(req, res) {
    saveRoom(req, res);
});


// Get One Room
function getRoom(id, res) {
    Room.get(id).then( function(result){
        res.send(JSON.stringify(result))
    }).error(handleError(res));
}

router.get('/:roomId', function(req, res) {
    getRoom(req.params.roomId, res)
});





// Get All Rooms
function getRooms(res) {
    Room.run().then( function(result){
        res.send(JSON.stringify(result))
    }).error(handleError(res));
}

router.get('/', function(req, res) {
    getRooms(res)
});






function updateSlots(req, res) {

    var room = new Room(req.body.room);

    Room.get(room.id).update({
        slots: room.slots
    }).run().then(function(room) {
        res.send(JSON.stringify(room));
    }).error(handleError(res));
}

router.post('/slots', function(req, res) {
    updateSlots(req, res)
});








function handleError(res) {
    return function(error) {
        return res.send(500, {error: error.message});
    }
}


module.exports = router;


