/**
 * Created by Benzo Media.
 * http://www.benzomedia.com
 * User: Oren Reuveni
 * Date: 01/05/2016
 * Time: 16:49
 */




angular.module('app').directive('calendar', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/calendar/calendar.component.html',
        controllerAs: 'calCtrl',
        controller: function ($scope, $rootScope, $http, $stateParams, $sce, $mdToast, $mdDialog) {
            var ctrl = this;

            //Set the first day of the week for momentJS
            localeData = moment.localeData()
            localeData.firstDayOfWeek(0);

            // Set the initial week
            ctrl.now = moment();

            ctrl.room = {};

            ctrl.selected = [];

            ctrl.message = $sce.trustAsHtml("No hours selected.");

            ctrl.okToBook = false;

            ctrl.user = {};

            setWeek();
            setUpSlots();


            $http.get('api/room/' + $stateParams.roomId).then(function (res) {
                ctrl.room = res.data;
                console.log(ctrl.room.booked);

                startup();


            }, function (error) {
                console.log(error);
            });


            $http.get("/api/user").then(function (response) {
                ctrl.user = response.data
            })


            ctrl.isLogged = function () {
                if (ctrl.user.id) {
                    return true;
                } else {
                    return false;
                }
            }


            // When a slot is clicked
            ctrl.hourClick = function (event) {
                var id = event.target.id;
                id = id.split("-");
                var day = id[0];
                var hour = id[1];

                if (ctrl.slots[day][hour].isBooked) {
                    $mdToast.show($mdToast.simple({position: "right bottom"}).textContent("Booked by " + ctrl.slots[day][hour].username));
                }

                //If the slot is available and not booked
                if (ctrl.slots[day][hour].isAvailable && !ctrl.slots[day][hour].isBooked) {

                    //If user is not logged in open login window
                    if (!ctrl.isLogged()) {
                        $rootScope.$broadcast("popLogin");
                        return
                    }


                    if (ctrl.slots[day][hour].isSelected) {
                        //Remove from selected
                        for (var i = 0; i < ctrl.selected.length; i++) {
                            if (moment(ctrl.selected[i].date).isSame(ctrl.week[day], "day") && ctrl.selected[i].hour == hour) {
                                ctrl.selected.splice(i, 1);
                            }
                        }
                        ctrl.slots[day][hour].isSelected = false;
                        calcSelection();

                    } else {
                        //Add to selected
                        ctrl.selected.push({
                            date: ctrl.week[day],
                            hour: hour,
                            user: ctrl.user.id,
                            username: ctrl.user.firstName + " " + ctrl.user.lastName
                        });
                        ctrl.slots[day][hour].isSelected = true;
                        console.log(ctrl.selected);
                        calcSelection();

                    }
                }
            }

            //Calculate the selection message according to selected slots array
            function calcSelection() {

                if (ctrl.selected.length > 0) {

                    var date = ctrl.selected[0].date;
                    //Get the selection date
                    for (var i = 1; i < ctrl.selected.length; i++) {
                        if (!moment(ctrl.selected[i].date).isSame(date, "day")) {
                            ctrl.message = $sce.trustAsHtml("Please select hours on the same day.");
                            ctrl.okToBook = false;
                            return;
                        }
                    }

                    var hours = [];

                    for (var i = 0; i < ctrl.selected.length; i++) {
                        hours.push(parseInt(ctrl.selected[i].hour));
                    }


                    //Sort the hours
                    hours = hours.sort(sortNumber);

                    //Check if hours are consecutive
                    for (var i = 0; i < hours.length - 1; i++) {
                        if (hours[i + 1] - hours[i] > 1) {
                            ctrl.message = $sce.trustAsHtml("Please select consecutive hours.");
                            ctrl.okToBook = false;
                            return;
                        }
                    }

                    ctrl.message = $sce.trustAsHtml("Your meeting is on <span class='thin'>" + moment(date).format("MMM DD YYYY") + "</span> from <span class='thin'>" + hours[0] + ":00</span> to <span class='thin'>" + (hours[hours.length - 1] + 1) + ":00</span>.");
                    ctrl.okToBook = true;

                } else {
                    ctrl.message = $sce.trustAsHtml("No hours selected.");
                    ctrl.okToBook = false;
                }


            }


            //Check which slots are available/booked
            function startup() {

                setUpSlots();
                setAvailable();
                setBooked();

            }


            function setAvailable() {
                for (var i = 0; i < ctrl.room.slots.length; i++) {

                    //If slot is of a recurring day of the week
                    if (ctrl.room.slots[i].isDate === false) {

                        var day = ctrl.room.slots[i].day;

                        for (var l = 0; l < ctrl.room.slots[i].hoursSlots.length; l++) {
                            var hour = ctrl.room.slots[i].hoursSlots[l].hour;

                            ctrl.slots[day][hour].isAvailable = true;

                        }

                    } else {
                        //If slot is of a specific date
                        for (var z = 0; z < 7; z++) {

                            if (moment(ctrl.room.slots[i].date).isSame(ctrl.week[z], 'day')) {

                                var day = z;

                                for (var l = 0; l < ctrl.room.slots[i].hoursSlots.length; l++) {
                                    var hour = ctrl.room.slots[i].hoursSlots[l].hour;

                                    ctrl.slots[day][hour].isAvailable = true;

                                }

                            }
                        }

                    }
                }
            }


            function setBooked() {
                if (typeof(ctrl.room.booked) !== 'undefined') {

                    for (var i = 0; i < ctrl.room.booked.length; i++) {

                        for (var z = 0; z < 7; z++) {

                            if (moment(ctrl.room.booked[i].date).isSame(ctrl.week[z], 'day')) {

                                var day = z;
                                var hour = parseInt(ctrl.room.booked[i].hour);

                                ctrl.slots[day][hour].isAvailable = false;
                                ctrl.slots[day][hour].isBooked = true;
                                ctrl.slots[day][hour].username = ctrl.room.booked[i].username;

                            }
                        }


                    }


                }
            }


            ctrl.bookRoom = function () {

                if (ctrl.okToBook) {

                    $mdDialog.show({
                        controller: ConfirmDialogController,
                        controllerAs: 'ctrl',
                        templateUrl:'/app/calendar/confirmationDialog.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose: true
                    })
                };
            }



            ctrl.clearSelection = function () {
                ctrl.message = $sce.trustAsHtml("No hours selected.");
                ctrl.selected = [];
                startup();
            }


            ctrl.isToday = function (day) {
                return moment(ctrl.week[day]).isSame(moment(), 'day');
            }


            ctrl.setToday = function () {
                ctrl.now = moment();
                setWeek();
                startup();
            }


            ctrl.addWeek = function () {
                ctrl.now.add(1, "weeks");
                setWeek();
                startup();
            }


            ctrl.subtractWeek = function () {
                ctrl.now.subtract(1, "weeks");
                setWeek();
                startup();
            }




            function ConfirmDialogController($mdDialog) {

                var ctrl = this;

                //Confirm Booking
                ctrl.confirm = function() {

                    confrimBooking()
                    $mdDialog.cancel();
                }


                //Close Dialog window
                ctrl.cancel = function () {
                    $mdDialog.cancel();
                };

            }



            function confrimBooking() {


                var data = {selected: ctrl.selected};


                $http.post('api/room/book/' + $stateParams.roomId, data)
                    .then(
                        function (response) {
                            ctrl.room = response.data;
                            ctrl.selected = [];
                            $mdToast.show($mdToast.simple({position: "right bottom"}).textContent("Room was booked"));
                            startup();
                            mixpanel.track("Book Room");
                        }, function (err) {

                        });

            }


            //Set the dates of the presented week
            function setWeek() {
                ctrl.week = [
                    ctrl.now.clone().day(0).toDate(),
                    ctrl.now.clone().day(1).toDate(),
                    ctrl.now.clone().day(2).toDate(),
                    ctrl.now.clone().day(3).toDate(),
                    ctrl.now.clone().day(4).toDate(),
                    ctrl.now.clone().day(5).toDate(),
                    ctrl.now.clone().day(6).toDate(),
                ]
            }

            //Create a fresh array of objects with all the slots currently presented
            function setUpSlots() {
                ctrl.slots = [];
                for (var i = 0; i < 7; i++) {
                    ctrl.slots[i] = {
                        8: {isAvailable: false, isBooked: false, isSelected: false},
                        9: {isAvailable: false, isBooked: false, isSelected: false},
                        10: {isAvailable: false, isBooked: false, isSelected: false},
                        11: {isAvailable: false, isBooked: false, isSelected: false},
                        12: {isAvailable: false, isBooked: false, isSelected: false},
                        13: {isAvailable: false, isBooked: false, isSelected: false},
                        14: {isAvailable: false, isBooked: false, isSelected: false},
                        15: {isAvailable: false, isBooked: false, isSelected: false},
                        16: {isAvailable: false, isBooked: false, isSelected: false},
                        17: {isAvailable: false, isBooked: false, isSelected: false},
                        18: {isAvailable: false, isBooked: false, isSelected: false},
                        19: {isAvailable: false, isBooked: false, isSelected: false},
                        20: {isAvailable: false, isBooked: false, isSelected: false},
                    };
                }

                //If there are slots seleted select them
                if (ctrl.selected.length > 0) {
                    for (var i = 0; i < ctrl.selected.length; i++) {
                        for (var l = 0; l < 7; l++) {
                            if (moment(ctrl.selected[i].date).isSame(ctrl.week[l], "day")) {
                                ctrl.slots[l][ctrl.selected[i].hour].isSelected = true;
                            }
                        }
                    }
                }
            }

            function sortNumber(a, b) {
                return a - b;
            }


        }
    }
});