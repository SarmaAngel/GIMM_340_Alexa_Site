//Libraries
const path = require('path');
const express = require('express');
const multer = require('multer');
const { check, checkSchema, validationResult } = require('express-validator');

const goods = require('./Model/goods');

const goodSubmissions = [];

//Setup defaults for script
const app = express();
app.use(express.static('public'));

const storage = multer.diskStorage({
    //Logic where to upload file
    destination: function (request, file, callback) {
        callback(null, 'uploads/')
    },
    //Logic to name the file when uploaded
    filename: function (request, file, callback) {
        /**
         * @source https://stackoverflow.com/questions/19811541/get-file-name-from-absolute-path-in-nodejs
         */
        callback(null, path.parse(file.originalname).name + '-' + Date.now() + path.parse(file.originalname).ext)
    }
})
const upload = multer({
    storage: storage,
    //Validation for file upload
    fileFilter: (request, file, callback) => {
        const allowedFileMimeTypes = ["image/png", "image/jpg", "image/jpeg"];
        callback(null, allowedFileMimeTypes.includes(file.mimetype));
    }
});
const port = 3000 //Default port to http server

//The * in app.* needs to match the method type of the request
// 'get' is the METHOD

app.get(
    // '/games/' is the PATH
    '/goods/',
    upload.none(),
    //check(..., ...),
    // This is the logic for processing a request
    // 'async' gives us access to 'await'
    async (request, response) => {
        let result = {};
        // Try the first block of code (try)
        //    then run the seconf block error if issues
        try {
            //STOP!!! Get results from the database
            result = await games.getAllGoods(request.query);
        } catch (error) {
            //The server message error code of 5XXS

            console.log(error);

            return response
                .status(500) //Error code
                .json({ message: 'Something went wrong with the server. get' });

        }
        //Default response object
        response.json({ 'data': result });
    });

    app.get(
    '/goods/:id',  //this is where I do stuff for UPDATE
    upload.none(),
    async (request, response) => {
        let result = {};
        try {
            result = await goods.getByID(request.params.id);
        } catch (error) {
            //The server message error code of 5XXS
            console.log(error); 
            return response
                .status(500) //Error code
                .json({ message: 'Something went wrong with the server. get id' });

        }
        //Default response object
        response.json({ 'data': result });
    });