/**
 * Created by Benzo Media.
 * http://www.benzomedia.com
 * User: Oren Reuveni
 * Date: 30/04/2016
 * Time: 10:06
 */



angular.module('app').directive('searchBar', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/rooms/search-bar/search-bar.component.html',
        controllerAs: 'ctrl',
        controller: function ($scope, $rootScope, $mdToast, $window, $location) {

            var ctrl = this;

            ctrl.minDate = new Date();

            //Check to see if there is a query in the url
            if( Object.keys($location.search()).length === 0 && $location.search().constructor === Object) {
                ctrl.query = {
                    location: "-1",
                    guests: "-1",
                    date: '',
                    from:"-1",
                    to: "-1"
                }
            } else {
                ctrl.query = JSON.parse($location.search().query);
                ctrl.query.date = new Date(ctrl.query.date);
            }




            //Submit
            ctrl.submit = function(){

               //Validate
               for(var key in ctrl.query){
                 if(ctrl.query[key] == "" || ctrl.query[key] == "-1") {
                     $mdToast.show($mdToast.simple({position: "right bottom"}).textContent('Please fill out all fields in the search bar'));
                     return;
                 }
               }


                if(! ($location.url().indexOf('room') > -1)) {
                    $window.location.href = "/room?query="+JSON.stringify(ctrl.query);
                } else {
                    $location.url("/room?query="+JSON.stringify(ctrl.query));
                    sendQuery();
                }

            }


            function sendQuery() {
                $rootScope.$broadcast("querySubmitted",{query: ctrl.query});
            }
        }
    }
});