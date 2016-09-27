/**
 * Created by Benzo Media.
 * http://www.benzomedia.com
 * User: Oren Reuveni
 * Date: 08/04/2016
 * Time: 07:33
 */


angular.module('app').directive('roomList', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/rooms/room-list/room-list.component.html',
        controllerAs: 'roomsCtrl',
        controller: function ($scope, $rootScope, $http, $location) {
            var ctrl = this;


            ctrl.rooms = [];
            ctrl.query = {};


            //Check to see if there is a query in the url
            if( Object.keys($location.search()).length === 0 && $location.search().constructor === Object) {
                ctrl.query = {
                    location: "-1",
                    guests: "-1",
                    date: '',
                    from:"-1",
                    to: "-1"
                }


                $http.get('api/room').then(
                    function (response) {
                        ctrl.rooms = response.data;
                    }, function (err) {
                        console.log(err);
                    });


            } else {
                ctrl.query = JSON.parse($location.search().query);
                ctrl.query.date = new Date(ctrl.query.date);
                searchRooms();
            }




            //Listen to time change and reBootstrap the app
            var unbindQuerySubmitted = $rootScope.$on('querySubmitted', function (event, data) {
                ctrl.query = data.query;
                searchRooms();
            });


            //Unbinding from rootScope (see more at:"http://stackoverflow.com/questions/11252780/whats-the-correct-way-to-communicate-between-controllers-in-angularjs")
            $scope.$on('$destroy', unbindQuerySubmitted);


            function searchRooms() {

                $http.post('api/room/search', ctrl.query)
                    .then(
                        function (response) {
                           ctrl.rooms = response.data;
                           // console.log(response.data);
                        }, function (err) {

                        });
            }


           this.isEmpty = function(){
               return ctrl.rooms.length == 0;
           }


        }
    }
});