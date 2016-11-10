/**
 * Created by Benzo Media.
 * http://www.benzomedia.com
 * User: Oren Reuveni
 * Date: 16/05/2016
 * Time: 20:18
 */


// config/auth.js

// expose our config directly to our application using module.exports
if (process.env.NODE_ENV == 'production') {

    module.exports = {

        'facebookAuth': {
            'clientID': '1100217973333725', // your App ID
            'clientSecret': '12b3922d9ad1473373fc13ee982fe7c1', // your App Secret
            'callbackURL': 'http://startup-friendly.com/auth/facebook/callback'
        },

        'twitterAuth': {
            'consumerKey': 'your-consumer-key-here',
            'consumerSecret': 'your-client-secret-here',
            'callbackURL': 'http://localhost:3000/auth/twitter/callback'
        },

        'googleAuth': {
            'clientID': 'your-secret-clientID-here',
            'clientSecret': 'your-client-secret-here',
            'callbackURL': 'http://localhost:3000/auth/google/callback'
        }

    }

} else {

    module.exports = {

        'facebookAuth': {
            'clientID': '1100217973333725', // your App ID
            'clientSecret': '12b3922d9ad1473373fc13ee982fe7c1', // your App Secret
            'callbackURL': 'http://localhost:8100/auth/facebook/callback'
        },

        'twitterAuth': {
            'consumerKey': 'your-consumer-key-here',
            'consumerSecret': 'your-client-secret-here',
            'callbackURL': 'http://localhost:3000/auth/twitter/callback'
        },

        'googleAuth': {
            'clientID': 'your-secret-clientID-here',
            'clientSecret': 'your-client-secret-here',
            'callbackURL': 'http://localhost:3000/auth/google/callback'
        }

    }
}