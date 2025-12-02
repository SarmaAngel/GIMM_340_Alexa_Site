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

//This is a POST request
app.post(
    '/goods/', //This is where I do stuff for INSERT
    upload.none(),

    //Validation for 'title' field in request
    check('productName', 'Please enter the product name').isLength({ min: 2 }),

    //Validation for 'platform' field in request
    check('type', 'Please enter the type of product.').isIn(['1', '2', '3', '4', '5', '6']),

    //Validation for 'amount' field in request
    check('amount', 'Please enter how much of a product there is, between 0 to 10.').isInt({ min: 0, max: 10 }),

    //Validation for 'choice' field in request
    check('isStocked', 'Please enter a choice.').isIn(['yes', 'no']),

    async (request, response) => {
        // Validate request
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response
                .status(400) // Error code
                .setHeader('Access-Control-Allow-Origin', '*') // Prevent CORS error
                .json({
                    message: 'Validation failed.',
                    errors: errors.array()
                });
        }
        let result = {};
        try {
            // Insert into database
            result = await goods.insert(request.body);

            // Add to goodSubmissions array
            const submission = request.body; // Assuming request.body contains the submission data
            goodSubmissions.push(submission);

            response
                .setHeader('Access-Control-Allow-Origin', '*') // Prevent CORS error
                .json({
                    message: 'Request fields and files are valid.',
                    goodSubmissions: goodSubmissions
                });
        } catch (error) {
            console.error(error); // Log the error for debugging
            return response
                .status(500) // Error code
                .json({ message: 'Something went wrong with the server. post' });
        }
    });

//This is a PUT request
app.put(
    '/goods/:id/', //This is where I do stuff for UPDATE
    upload.none(),

    // Validation for 'product name' field
    check('productName', 'Please enter a product name').isLength({ min: 2 }),

    //Validation for 'type' field in request
    check('type', 'Please enter the type of product.').isIn(['1', '2', '3', '4', '5', '6']),

    //Validation for 'amount' field in request
    check('amount', 'Please enter how much of a product there is, between 0 to 10.').isInt({ min: 0, max: 10 }),

    //Validation for 'choice' field in request
    check('isStocked', 'Please enter a choice.').isIn(['yes', 'no']),

    async (request, response) => {
        // Validate request
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response
                .status(400) // Error code
                .json({
                    message: 'Validation failed.',
                    errors: errors.array()
                });
        }

        let result = {};
        try {
            // Update the database
            result = await goods.edit(request.params.id, request.body);
            response.json({ message: 'Product updated successfully.', data: result });
        } catch (error) {
            console.error(error); // Log the error for debugging
            return response
                .status(500) // Error code
                .json({ message: 'Something went wrong with the server. put' });
        }
    });

//This is a DELETE request
app.delete(
    '/goods/:id/',
    upload.none(),
    async (request, response) => {
        let result = {};
        try {
            result = await goods.remove(request.params.id);
        } catch (error) {
            //The server message error code of 5XXS
            return response
                .status(500) //Error code
                .json({ message: 'Something went wrong with the server.' });

        }
        //Default response object
        response.json({ 'data': result });
    });

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})