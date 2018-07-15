/*
Comment Model
--------------
Creates a Comment Schema and store the Comments properties.
*/

const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let CommentSchema = new Schema({

    title: {
        type: String,
    },

    body: {
        type: String,
        required: true
    }

});

let Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;