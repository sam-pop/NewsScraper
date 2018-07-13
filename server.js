// Dependencies
const request = require('request');
const bodyParser = require('body-parser');
const express = require('express');
const exphbs = require('express-handlebars');
const cheerio = require('cheerio');
const mongoose = require('mongoose');

// Variables
const PORT = process.env.PORT || 8080;
const db = require('./models');

// Init express app
const app = express();

// Init body parser middleware
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Static serve the public folder
app.use(express.static('public'));

// If deployed, use the deployed database. Otherwise use the local newsScraper database
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsScraper";
// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// Handlebars view engine init
app.engine('.hbs', exphbs({
    defaultLayout: "main",
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

// Routes
require('./routes/html_routes')(app);
require('./routes/api_routes')(app);