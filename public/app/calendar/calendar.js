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
        controller: function ($scope, $rootScope, $http, $stateParams) {
            var ctrl = this;

            localeData = moment.localeData()
            localeData.firstDayOfWeek(0);

            // Set the initial week
            ctrl.now = moment();
            setWeek();

            ctrl.slots = {};

            $http.get('api/room/' + $stateParams.roomId).then(function (res) {
                ctrl.slots = res.data.slots;
                console.log(ctrl.slots);
            }, function (error) {
                console.log(error);
            });



            ctrl.isAvailable = function(id) {

                var id = id.split("-");

                var day = id[0];
                var hour = id[1];


                for(var i = 0; i < ctrl.slots.length; i++){

                    //Find out if the day of the week matches
                    if(ctrl.slots[i].isDate === false) {

                        if(ctrl.slots[i].day === day) {

                            //Check each of the hours for matches
                            for (var l = 0; l < ctrl.slots[i].hoursSlots.length; l++) {
                                if (ctrl.slots[i].hoursSlots[l].hour === hour) {
                                    return true;
                                }
                            }
                        }

                    } else {

                        if(moment(ctrl.slots[i].date).isSame(ctrl.week[day], 'day')) {

                            //Check each of the hours for matches
                            for (var l = 0; l < ctrl.slots[i].hoursSlots.length; l++) {
                                if (ctrl.slots[i].hoursSlots[l].hour === hour) {

                                    return true;
                                }
                            }
                        }
                        

                    }

                }

                return false;

            }













            ctrl.addWeek = function() {
                ctrl.now.add(1, "weeks");
                setWeek();
            }


            ctrl.subtractWeek = function(){
                ctrl.now.subtract(1, "weeks");
               setWeek();
            }

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
        }
    }
});