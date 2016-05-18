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
    function (ctrl$scope, $rootScope, $http, $stateParams, $mdDialog, $mdMedia) {

        var ctrl = this;

        ctrl.user = [];

        $http.get("/api/user").then(function (response) {
            ctrl.user = response.data
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

    }]);



