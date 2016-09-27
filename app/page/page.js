/**
 * Created by Benzo Media.
 * http://www.benzomedia.com
 * User: Oren Reuveni
 * Date: 10/06/2016
 * Time: 09:37
 */

angular.module('app').directive('about', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/page/templates/about.component.html',
        controllerAs: 'ctrl',
        controller: function () {

        }
    };
});

angular.module('app').directive('terms', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/page/templates/terms.component.html',
        controllerAs: 'ctrl',
        controller: function () {

        }
    };
});


angular.module('app').directive('contact', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/page/templates/contact.component.html',
        controllerAs: 'ctrl',
        controller: function ($http) {

            var ctrl = this;
            ctrl.isSending = false;
            ctrl.message = '';

            ctrl.form = {
                name: '',
                email: '',
                subject: '',
                message: ''
            }


            ctrl.submitContact = function() {
                ctrl.isSending = true;
                ctrl.message = '';

                $http.post('api/user/contact', ctrl.form)
                    .then(
                        function (response) {
                            ctrl.isSending = false;
                            console.log(response);
                            if(response.data.success == true){
                                ctrl.form = {
                                    name: '',
                                    email: '',
                                    subject: '',
                                    message: ''
                                }
                                ctrl.message = "Thanks, your message was sent successfuly."
                            } else {
                                ctrl.message = "Oops, your message could not be sent. Please try again later."
                            }
                        }, function (err) {
                            console.log(err);
                        });

            }


        }
    };
});