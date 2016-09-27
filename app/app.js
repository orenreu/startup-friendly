/**
 * Created by Benzo Media.
 * http://www.benzomedia.com
 * User: Oren Reuveni
 * Date: 04/04/2016
 * Time: 17:53
 */

// Import main SASS
require('../scss/main.scss')

// Creating angular app
const app = angular.module('app', [
    "ngMaterial",
    'ui.router',
    'ngFileUpload',
    'ui.bootstrap',
    'angularUtils.directives.dirPagination'
])

// Registering controllers
require('./calendar/calendar')(app)
require('./meetings/meetings')(app)
require('./page/page')(app)
require('./rooms/room-details/room-details')(app)
require('./rooms/image-upload/image-upload')(app)
require('./rooms/logo-upload/logo-upload')(app)
require('./rooms/new-room/new-room')(app)
require('./rooms/room-list/room-list')(app)
require('./rooms/search-bar/search-bar')(app)
require('./rooms/slots/slots')(app)
require('./toolbar/toolbar')(app)
require('./welcome/welcome')(app)



// Configure routes
require('./routes')