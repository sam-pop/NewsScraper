const request = require('request');
const cheerio = require('cheerio');

const db = require('../models');

module.exports = function (app) {

    app.get('/api/clear', function (req, res) {
        db.Article.remove({}, function (err) {
            console.log('Article collection removed');
        });
        db.Comment.remove({}, function (err) {
            console.log('Comment collection removed');
        });
        res.redirect('/');
    });

    // scrapes ynetnews website for news articles and stores them in the db
    app.get('/update', function (req, res) {
        request('https://www.ynetnews.com/home/0,7340,L-3082,00.html', function (error, response, body) {
            // request('https://www.ynet.co.il/home/0,7340,L-4686,00.html', function (error, response, body) {

            let $ = cheerio.load(body);

            $('div.art_headlines_item').each(function (i, element) {
                let result = {};

                // convert the date from string to dd/MM/YYY date format
                let dateString = $(element).find('div.art_headlines_details').text().trim().slice(-8);
                let dataSplit = dateString.split('.');
                dataSplit[2] = "20" + dataSplit[2];
                let dateConverted;
                if (dataSplit[2].split(" ").length > 1) {
                    var hora = dataSplit[2].split(" ")[1].split(':');
                    dataSplit[2] = dataSplit[2].split(" ")[0];
                    dateConverted = new Date(dataSplit[2], dataSplit[1] - 1, dataSplit[0], hora[0], hora[1]);
                } else {
                    dateConverted = new Date(dataSplit[2], dataSplit[1] - 1, dataSplit[0]);
                }

                // let mydate = new Date(date.replace(pattern, '$3-$2-$1'));
                result.headline = $(element).find('h4').find('a').text();
                result.summary = $(element).find('a.art_headlines_sub_title').text();
                result.published = dateConverted;
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
        setTimeout(function () {
            res.redirect('/');
        }, 2000);
    });

    // returns all the articles in the db
    app.get('/api/articles', function (req, res) {
        db.Article.find({}).sort({
                scrapeDate: -1
            })
            .then(function (dbArticle) {
                res.render('index', {
                    news: dbArticle
                });
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    // returns a specific article by id (and the associated comments)
    app.get('/api/articles/:id', function (req, res) {
        db.Article.findOne({
                _id: req.params.id
            })
            .populate('comments')
            .then(function (dbArticle) {
                console.log(dbArticle);
                res.json(dbArticle.comments);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    // adds a comment to an article (by article id)
    app.post('/api/articles/:id', function (req, res) {
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

    // deletes a comment from an article
    app.delete("/api/articles/:id/:comment", function (req, res) {
        db.Comment.remove({
            _id: req.params.comment
        }, function (err) {
            if (err)
                res.json(err);
            else {
                db.Article.findOneAndUpdate({
                    _id: req.params.id
                }, {
                    $pullAll: {
                        comments: [req.params.comment]
                    }
                }, {
                    new: true
                }, function (err, data) {
                    if (err)
                        res.json(err);
                });
            }
        });
    });

    // returns all the saved articles in the db
    app.get('/api/saved', function (req, res) {
        db.Article.find({
                saved: true
            })
            .then(function (dbArticle) {
                res.render('saved', {
                    news: dbArticle
                });
                // res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    // mark the article as "saved"
    app.post('/api/saved/:id/save', function (req, res) {
        db.Article.findOneAndUpdate({
                _id: req.params.id
            }, {
                saved: true
            })
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    // unmark the article as "saved" (not-saved)
    app.post('/api/saved/:id/delete', function (req, res) {
        db.Article.findOneAndUpdate({
                _id: req.params.id
            }, {
                saved: false
            })
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

};