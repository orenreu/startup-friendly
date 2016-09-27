/**
 * Created by Benzo Media.
 * http://www.benzomedia.com
 * User: Oren Reuveni
 * Date: 27/09/2016
 * Time: 6:21
 */
const path = require('path')

module.exports = {
    context: __dirname + '/app',
    entry: './app.js',
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'bundle.js',
        publicPath: '/'
    },
}