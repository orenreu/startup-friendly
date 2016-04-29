/**
 * Created by Benzo Media.
 * http://www.benzomedia.com
 * User: Oren Reuveni
 * Date: 08/04/2016
 * Time: 07:38
 */

//js hint ecversion 6

angular.module('app').directive('newRoom', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/rooms/new-room/new-room.component.html',
        controllerAs: 'ctrl',
        controller: function ($http, $state) {

            var ctrl = this;

            ctrl.newRoom = {
                name: "Great Room",
                company: "Benzo Media",
                address: "3 fuld Bracha St.",
                floor: "4",
                entrance: "1",
                city_part: "center",
                guests: 4,
                wifi_name: "Monkey",
                wifi_pass: "0544322918",
                description: "What a great room",
                contact_name: "Oren Reuveni",
                email: "orenreu@gmail.com",
                phone: "054-4322918"
            };


            ctrl.addRoom = function (room) {
                
                // Insert a room into the collection

                var data = {room:room}

                $http.post('api/room/create', data)
                    .then(
                        function (response) {
                            $state.go('slots',{roomId : response.data.id});
                        }, function (err) {

                        });

                // Clear form
            }
        }
    }
});