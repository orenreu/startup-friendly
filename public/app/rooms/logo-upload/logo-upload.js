/**
 * Created by Benzo Media.
 * http://www.benzomedia.com
 * User: Oren Reuveni
 * Date: 30/04/2016
 * Time: 16:23
 */




angular.module('app').directive('logoUpload', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/rooms/logo-upload/logo-upload.component.html',
        controller: 'LogoUploadController'
    }
}).controller('LogoUploadController', function ($scope, Upload, $timeout, $rootScope) {

    $scope.image = "";



    //Function to upload files
    $scope.uploadFiles = function (file, errFiles) {


        //Signal the progress bar to start runnging
        $scope.uploadingImage = true;

        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = Upload.upload({
                url: 'api/logo-upload/logo',
                data: {file: file}
            });

            file.upload.then(function (response) {

                //Stop progress bar
                $scope.uploadingImage = false;
                //Assign new url to image
                $scope.image = response.data;

                //Send new url to new-room controller
                $rootScope.$broadcast("logoUploaded", {url:$scope.image});



                $timeout(function () {
                    file.result = response.data;
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 *
                    evt.loaded / evt.total));
            });
        }
    }


});


