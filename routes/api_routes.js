const request = require('request');
const cheerio = require('cheerio');

const db = require('../models');

module.exports = function (app) {

    // scrapes ynetnews website for news articles and stores them in the db
    app.get('/scrape', function (req, res) {
        request('https://www.ynetnews.com/home/0,7340,L-3082,00.html', function (error, response, body) {

            let $ = cheerio.load(body);

            $('div.art_headlines_item').each(function (i, element) {
                let result = {};

                result.headline = $(element).find('h4').find('a').text();
                result.summary = $(element).find('a.art_headlines_sub_title').text();
                result.published = $(element).find('div.art_headlines_details').text();
                result.url = 'http://www.ynetnews.com' + $(element).find('h4').find('a').attr('href');
                result.pic = $(element).find('a.art_headlines_image').find('img').attr('src');

                db.Article.create(result)
                    .then(function (dbArticle) {
                        console.log(dbArticle);
                    })
                    .catch(function (err) {
                        return err;
                    });
            });
        });
        res.send('News articles updated!');
    });

    // returns all the articles in the db
    app.get('/api/articles', function (req, res) {
        db.Article.find({})
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    // returns a specific article by id (and the associated comments)
    app.get("/api/articles/:id", function (req, res) {
        db.Article.findOne({
                _id: req.params.id
            })
            .populate("comments")
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    // adds a comment to an article (by article id)
    app.post("/api/articles/:id", function (req, res) {
        db.Comment.create(req.body)
            .then(function (dbComment) {
                return db.Article.findOneAndUpdate({
                    _id: req.params.id
                }, {
                    $push: {
                        comments: dbComment._id
                    }
                }, {
                    new: true
                });
            })
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    app.post('api/articles/:id/save', function (req, res) {
            db.Article.findOneAndUpdate({
                _id: req.params.id
            }, {
                saved: true
            }, {
                new: true
            });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });


};