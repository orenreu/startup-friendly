/**
 * Created by Benzo Media.
 * http://www.benzomedia.com
 * User: Oren Reuveni
 * Date: 18/04/2016
 * Time: 03:52
 */






angular.module('app').directive('imageUpload', function () {
    return {
        restrict: 'E',
        templateUrl: 'client/rooms/image-upload/image-upload.component.html',
        controllerAs: 'ctrl',
        controller: 'ImageUploadController'
    }
}).controller('ImageUploadController', function ($scope,
                                                 $reactive,
                                                 Upload,
                                                 $timeout) {

    $reactive(this).attach($scope);

    var ctrl = this;



    ctrl.uploadFiles = function (file, errFiles) {


       ctrl.s3creds = createS3Credentials(file.type);
        
        console.log(ctrl.s3creds);

        ctrl.f = file;
        ctrl.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = Upload.upload({
                url: 'https://s3-eu-west-1.amazonaws.com/su-friendly/', //S3 upload url including bucket name
                method: 'POST',
                data: {
                    key: "testing/"+file.name, // the key to store the file on S3, could be file name or customized
                    AWSAccessKeyId: 'AKIAJOUB6EYQK4A5UATA',
                    acl: 'public-read', // sets the access to the uploaded file in the bucket: private, public-read, ...
                    policy: ctrl.s3creds.s3Policy, // base64-encoded json policy (see article below)
                    signature: ctrl.s3creds.s3Signature, // base64-encoded signature based on policy string (see article below)
                    "Content-Type": file.type != '' ? file.type : 'application/octet-stream', // content type of the file (NotEmpty)
                    filename: file.name, // this is needed for Flash polyfill IE8-9
                    file: file
                }
            });

            file.upload.then(function (response) {
                console.log(response);
                $timeout(function () {
                    file.result = response.data;
                });
            }, function (response) {
                if (response.status > 0)
                    ctrl.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 *
                    evt.loaded / evt.total));
            });
        }
    }









    function createS3Credentials(contentType) {

        var config = {
            "AWSAccessKeyId": "AKIAJOUB6EYQK4A5UATA",
            "AWSSecretKey": "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"
        }

        var date = new Date();

        var s3Policy = {
            "expiration": "2018-12-01T12:00:00.000Z", // hard coded for testing
            "conditions": [
                ["starts-with", "$key", "testing/"],
                {"bucket": "su-friendly"},
                {"acl": "public-read"},
                ["starts-with", "$Content-Type", contentType],
                {"success_action_redirect": "http://benzomedia.com"},
            ]
        };

        // stringify and encode the policy
        var stringPolicy = JSON.stringify(s3Policy);
        var base64Policy = Buffer(stringPolicy, "utf-8").toString("base64");

        // sign the base64 encoded policy
        var presignature = CryptoJS.HmacSHA1(base64Policy, config.AWSSecretKey);
        var signature = btoa(presignature);


        // build the results object
        var s3Credentials = {
            s3Policy: base64Policy,
            s3Signature: signature
        };

        // send it back
        return s3Credentials;
    };


});


