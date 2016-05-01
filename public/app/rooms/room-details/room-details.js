/**
 * Created by Benzo Media.
 * http://www.benzomedia.com
 * User: Oren Reuveni
 * Date: 08/04/2016
 * Time: 07:34
 */


angular.module('app').directive('roomDetails', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/rooms/room-details/room-details.component.html',
        controllerAs: 'ctrl',
        controller: function ($scope, $rootScope, $http, $stateParams) {
            var ctrl = this;

            ctrl.room = {};

            $http.get('api/room/' + $stateParams.roomId).then(function (res) {
                ctrl.room = res.data;
            }, function (error) {
                console.log(error);
            });
        }
    }
});