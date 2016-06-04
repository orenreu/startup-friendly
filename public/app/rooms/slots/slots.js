/**
 * Created by Benzo Media.
 * http://www.benzomedia.com
 * User: Oren Reuveni
 * Date: 09/04/2016
 * Time: 08:15
 */

angular.module('app').directive('editSlots', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/rooms/slots/slots.component.html',
        controllerAs: 'ctrl',
        controller: function ($scope, $stateParams, $mdToast, $http) {


            var ctrl = this;

            ctrl.minDate = new Date();

            ctrl.room = {};

            $http.get('api/room/'+$stateParams.roomId).then(function(res){
               ctrl.room = res.data;
            }, function(error) {
                console.log(error);
            });

            ctrl.newSlot = {
                isDate: false,
                date: null,
                day: null,
                hoursFrom: "",
                hoursTo: "",
                hoursSlots: []
            };


            ctrl.saveSlot = function () {

                //Validate
               if(ctrl.newSlot.date == "" && ctrl.newSlot.day == ""){
                   return;
               }

                if(ctrl.newSlot.hoursTo == "" || ctrl.newSlot.hoursFrom == ""){
                    return;
                }




                var hours = ctrl.newSlot.hoursTo - ctrl.newSlot.hoursFrom;

                //if hours is negative hours were not input correctly
                if(hours <= 0) {
                    $mdToast.show($mdToast.simple({position: "right bottom"}).textContent("A meeting can't end before it began."));
                    return;
                }


                var firstHour = parseInt(ctrl.newSlot.hoursFrom);
                for (var i = 0; i < hours; i++) {
                    ctrl.newSlot.hoursSlots.push({hour: firstHour});
                    firstHour++;
                }

                if(!ctrl.room.slots){
                    ctrl.room.slots = [];
                }
                ctrl.room.slots.push(ctrl.newSlot);


                //Persist in DB
               $http.post('api/room/slots',{room: ctrl.room}).then(
                   function(result) {
                   ctrl.room = result.data;
                   }, function(error) {
                       console.log(error);
                   });

                ctrl.newSlot = {
                    isDate: false,
                    date: null,
                    day: null,
                    hoursFrom: 8,
                    hoursTo: 12,
                    hoursSlots: []
                };
            }

            ctrl.removeSlot = function(index) {
                ctrl.room.slots.splice(index,1);

                //Persist in DB
                $http.post('api/room/slots',{room: ctrl.room}).then(
                    function(result) {
                        ctrl.room = result.data;
                    }, function(error) {
                        console.log(error);
                    });
            }
        }
    }


});


angular.module('app').filter('weekDay', function() {
    return function (input) {

        switch(input) {
            case "0":
                return 'Sunday'
                break;
            case "1":
                return 'Monday'
                break;
            case "2":
                return 'Tuesday'
                break;
            case "3":
                return 'Wedensday'
                break;
            case "4":
                return 'Thursday'
                break;
            case "5":
                return 'Friday'
                break;
            case "6":
                return 'Saturday'
                break;

        }

    };
});

angular.module('app').filter('hourFilt', function(){
    return function (input) {
        if(input > 9){
            return input+":00";
        } else {
            return "0"+input+":00";
        }
    }
});