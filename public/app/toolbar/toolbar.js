/**
 * Created by Benzo Media.
 * http://www.benzomedia.com
 * User: Oren Reuveni
 * Date: 17/05/2016
 * Time: 17:31
 */


angular.module('app').controller('ToolbarController', [
    '$scope',
    '$rootScope',
    '$http',
    '$stateParams',
    '$mdDialog',
    '$mdMedia',
    '$location',
    function ($scope, $rootScope, $http, $stateParams, $mdDialog, $mdMedia, $location) {

        var ctrl = this;

        ctrl.user = {};

        $http.get("/api/user").then(function (response) {
            ctrl.user = response.data
           // console.log(ctrl.user);
        })


        ctrl.isLogged = function () {
            if( ctrl.user.id) {
                return true;
            } else {
                return false;
            }
        }

      

        ctrl.login = function () {
           openLogintDialog();
        }

        //Open the Edit Project Dialog
        function openLogintDialog() {
            ctrl.status = '';
            ctrl.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && ctrl.customFullscreen;

            $mdDialog.show({
                controller: LoginDialogController,
                templateUrl:'app/toolbar/loginDialog.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true
            })
        }

        function LoginDialogController($scope, $mdDialog) {
            $scope.closeDialog = function () {
                $mdDialog.cancel();
            }
        };




        //Listen to time change and reBootstrap the app
        var unbindPopLogin = $rootScope.$on('popLogin', function (event) {
            openLogintDialog();
        });

        //Unbinding from rootScope (see more at:"http://stackoverflow.com/questions/11252780/whats-the-correct-way-to-communicate-between-controllers-in-angularjs")
        $scope.$on('$destroy', unbindPopLogin);


    }]);



