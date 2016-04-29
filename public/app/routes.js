/**
 * Created by Benzo Media.
 * http://www.benzomedia.com
 * User: Oren Reuveni
 * Date: 08/04/2016
 * Time: 07:31
 */

angular.module('app').config(function ($urlRouterProvider, $stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $stateProvider
        .state('welcome', {
            url: '/',
            template: '<welcome-page></welcome-page>'
        })
        .state('room', {
            url: '/room',
            template: '<room-list></room-list>'
        })
        .state('newRoom', {
            url: '/room/create',
            template: '<new-room></new-room>'

        })
        .state('roomDetails', {
            url: '/room/:roomId',
            template: '<room-details></room-details>',

        })
        .state('slots', {
            url: '/slots/:roomId',
            template: '<edit-slots></edit-slots>'

        });

    $urlRouterProvider.otherwise("/");
});

