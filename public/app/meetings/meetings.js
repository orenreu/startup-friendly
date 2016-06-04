/**
 * Created by Benzo Media.
 * http://www.benzomedia.com
 * User: Oren Reuveni
 * Date: 25/05/2016
 * Time: 07:44
 */


angular.module('app').directive('meetings', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/meetings/meetings.component.html',
        controllerAs: 'meetingsCtrl',
        controller: function ($scope, $rootScope, $http, $stateParams, $mdToast, $mdDialog) {
            var ctrl = this;

            ctrl.meetings = [];

            $http.get('api/meeting').then(
                function (response) {
                    ctrl.meetings = response.data;
                    console.log(ctrl.meetings);
                }, function (err) {
                    console.log(err);
                });


            ctrl.removeMeeting = function (index) {

                        $mdDialog.show({
                            controller: DeleteDialogController,
                            controllerAs: 'ctrl',
                            templateUrl:'/app/meetings/deleteDialog.html',
                            parent: angular.element(document.body),
                            clickOutsideToClose: true,
                            locals: {index: index}
                        })

            }




            function DeleteDialogController(index, $mdDialog) {

                var ctrl = this;

                //Confirm Deletion
                ctrl.confirm = function() {
                    confrimDeletion(index)
                    $mdDialog.cancel();
                }


                //Close Dialog window
                ctrl.cancel = function () {
                    $mdDialog.cancel();
                };
            }


            function confrimDeletion(index) {

                $http.get('api/meeting/delete/' + ctrl.meetings[index].id).then(
                    function (result) {
                        ctrl.meetings.splice(index, 1);
                        $mdToast.show($mdToast.simple({position: "right bottom"}).textContent("Meeting was cancelled"));
                    }, function (error) {
                        console.log(error);
                    });
            }


        }
    }

})