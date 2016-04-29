/**
 * Created by Benzo Media.
 * http://www.benzomedia.com
 * User: Oren Reuveni
 * Date: 08/04/2016
 * Time: 07:46
 */


angular.module('app').directive('welcomePage', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/welcome/welcome.html',
        controllerAs: 'ctrl',
        controller: function ($scope) {


        }
    };
});