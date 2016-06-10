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

            ctrl.form = {
                name: '',
                email: '',
                subject: '',
                message: ''
            }


            ctrl.submitContact = function() {


                $http.post('api/user/contact', ctrl.form)
                    .then(
                        function (response) {
                            console.log(response);
                        }, function (err) {
                            console.log(err);
                        });

            }


        }
    };
});