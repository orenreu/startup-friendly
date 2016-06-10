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
        controller: function ($scope, $http, $state, $rootScope) {

            var ctrl = this;

            ctrl.newRoom = {
               /* name: "Great Room",
                company: "Benzo Media",
                address: "3 fuld Bracha St.",
                floor: "4",
                entrance: "1",
                city_part: "center",
                guests: 4,
                wifi_name: "Monkey",
                wifi_pass: "0544322918",
                description: "What a great room",
                image: "",
                logo: "",
                contact_name: "Oren Reuveni",
                email: "orenreu@gmail.com",
                phone: "054-4322918"*/
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



            //Listen to time change and reBootstrap the app
            var unbindImageUploaded = $rootScope.$on('imageUploaded', function (event, data) {
                ctrl.newRoom.image = data.url;
            });

            //Unbinding from rootScope (see more at:"http://stackoverflow.com/questions/11252780/whats-the-correct-way-to-communicate-between-controllers-in-angularjs")
            $scope.$on('$destroy', unbindImageUploaded);


            //Listen to time change and reBootstrap the app
            var unbindLogoUploaded = $rootScope.$on('logoUploaded', function (event, data) {
                ctrl.newRoom.logo = data.url;
            });

            //Unbinding from rootScope (see more at:"http://stackoverflow.com/questions/11252780/whats-the-correct-way-to-communicate-between-controllers-in-angularjs")
            $scope.$on('$destroy', unbindLogoUploaded);



            ctrl.isImage = function(){
                return ctrl.newRoom.image !== "";
            }

            ctrl.isLogo = function(){
                return ctrl.newRoom.logo !== "";
            }


        }
    }
});