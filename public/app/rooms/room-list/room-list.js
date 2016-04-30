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
        controllerAs: 'ctrl',
        controller: function ($scope, $rootScope, $http) {
            var ctrl = this;

            ctrl.rooms = [];

            $http.get('api/room').then(
                function (response) {
                  ctrl.rooms = response.data;
                }, function (err) {
                    console.log(err);
                });

        }
    }
});