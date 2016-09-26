/**
 * Created by Benzo Media.
 * http://www.benzomedia.com
 * User: Oren Reuveni
 * Date: 29/04/2016
 * Time: 18:32
 */
const router = require('express').Router();
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var cloudinary = require('cloudinary');
var constants = require('../config/constants');
var fs = require("fs");

cloudinary.config({
    cloud_name: constants.CLOUDINARY_NAME,
    api_key: constants.CLOUDINARY_API_KEY,
    api_secret: constants.CLOUDINARY_API_SECRET
});

router.post('/', upload.single('file'), function (req, res, next) {

    // Grab extension from uploaded file
    var re = /(?:\.([^.]+))?$/;
    var extension = re.exec(req.file.originalname)[1];

    // Move the file to uploads folder
    var path = './public/uploads/'+req.file.filename+"."+extension;
    fs.rename(req.file.path, path);

    // Upload file to cloudinary
    cloudinary.uploader.upload(path, function(result) {
        // Send uploaded image url back
        var url = result.url
        res.status(200).send(url);

        // Delete local copy
        fs.unlink(path);
    },{
        width: 540,
        height: 400,
        crop: "scale"
    });


});




router.post('/logo', upload.single('file'), function (req, res, next) {

    // Grab extension from uploaded file
    var re = /(?:\.([^.]+))?$/;
    var extension = re.exec(req.file.originalname)[1];

    // Move the file to uploads folder
    var path = './public/uploads/'+req.file.filename+"."+extension;
    fs.rename(req.file.path, path);

    // Upload file to cloudinary
    cloudinary.uploader.upload(path, function(result) {
        // Send uploaded image url back
        var url = result.url
        res.status(200).send(url);

        // Delete local copy
        fs.unlink(path);
    },{
        width: 90,
        height: 90,
        crop: "fit"
    });


});

module.exports = router;