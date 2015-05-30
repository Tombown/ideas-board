// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var validate = require("validate.js"); // error validator on idea input

// configuration =================

mongoose.connect('localhost:27017');     // connect to mongoDB database on modulus.io

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.set('views', __dirname + '/templates/');
app.set('view engine', 'jade');
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

 // define model =================
    var Idea = mongoose.model('Idea', {
        text : String
    });

// routes ======================================================================

    // api ---------------------------------------------------------------------
    // get all ideas
    app.get('/api/ideas', function(req, res) {

        // use mongoose to get all ideas in the database
        Idea.find(function(err, ideas) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(ideas); // return all ideas in JSON format
        });
    });

    // create idea and send back all ideas after creation
    app.post('/api/ideas', function(req, res) {

        // create a idea, information comes from AJAX request from Angular
        Idea.create({
            text : req.body.text,
            done : false
        }, function(err, idea) {
            if (err)
                res.send(err);

            // get and return all the ideas after you create another
            Idea.find(function(err, ideas) {
                if (err)
                    res.send(err)
                res.json(ideas);
            });
        });

    });

    // delete a idea
    app.delete('/api/ideas/:idea_id', function(req, res) {
        Idea.remove({
            _id : req.params.idea_id
        }, function(err, idea) {
            if (err)
                res.send(err);

            // get and return all the ideas after you create another
            Idea.find(function(err, ideas) {
                if (err)
                    res.send(err)
                res.json(ideas);
            });
        });
    });

 // application -------------------------------------------------------------
    app.get('*', function(req, res) {
        res.render('views'); // load the single view file (angular will handle the page changes on the front-end)
    });

// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");
