/**
 * Created by Benzo Media.
 * http://www.benzomedia.com
 * User: Oren Reuveni
 * Date: 27/05/2016
 * Time: 20:31
 */
const router = require('express').Router();
const Room = require('../models/index').Room;
const User = require('../models/index').User;
const Meeting = require('../models/index').Meeting;
const r = require('../models/index').r
const moment = require('moment');
const mailer = require('../config/mail')
const constants = require('../config/constants')




// Get All Meetings
function getMeetings(res) {
    Meeting.run().then(function (result) {
        res.status(200).send(JSON.stringify(result))
    }).error(handleError(res));
}

router.get('/', function (req, res) {
    getMeetings(res)
});


//Delete Meeting

function removeMeeting(id, res) {

    Meeting.get(id).getJoin({room: true}).run().then(function (meeting) {

        //Remove booked slots from room
        var i = meeting.room.booked.length
        while (i--) {
            if(meeting.room.booked[i].meetingId == meeting.id){
                meeting.room.booked.splice(i, 1);
            }
        }


        //Save changes to room
        meeting.saveAll({room: true}).then(function(meeting) {

            User.get(meeting.userId).then(function(user){

                var mailData = {
                    date: moment(meeting.date).format("dddd, MMMM Do YYYY"),
                    from: meeting.hoursFrom,
                    to: meeting.hoursTo,
                    room: meeting.room.name,
                    address: meeting.room.address,
                    company: meeting.room.company,
                    roomId: meeting.room.id,
                    userName: user.firstName+" "+user.lastName,
                    roomEmail: meeting.room.email,
                    userEmail: user.email,
                    userId: user.id
                }

                //Email admin
                mailer.sendMail(constants.ADMIN_EMAIL, constants.SYSTEM_NAME, "A meeting was cancelled", 'cancel_booking/admin_cancel_booking.html',mailData);
                //Email room contact person
                mailer.sendMail(meeting.room.email, meeting.room.contact_name, "A meeting was cancelled", 'cancel_booking/contact_person_cancel_booking.html', mailData);
                //Email User
                mailer.sendMail(user.email,user.firstName+" "+user.lastName, "You cancelled a meeting", 'cancel_booking/user_cancel_booking.html', mailData);



                meeting.delete().then(function(result) {

                    res.status(200).send(JSON.stringify(result))

                }).error(handleError(res));



            }).error(handleError(res));

        }).error(handleError(res));

    }).error(handleError(res));


}

router.get('/delete/:meetingId', function (req, res) {
    removeMeeting(req.params.meetingId, res)
});












//Handle Error
function handleError(res) {
    return function (error) {
        res.status(500).send({error: error.message})
    }
}


module.exports = router;