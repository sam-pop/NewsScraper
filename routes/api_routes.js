const request = require('request');
const cheerio = require('cheerio');

const db = require('../models');

module.exports = function (app) {

    app.get('/scrape', function (req, res) {
        request('https://www.ynetnews.com/', function (error, response, body) {
            res.json(body);


        });

    });



};