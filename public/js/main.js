$(function () {

    // add/remove article from "saved-articles"
    $('.article').on('click', '.articleSaveBtn', function (e) {
        let id = $(this).parent().data('article_id');
        let saved = $(this).data('saved');
        switch (saved) {
            case false:
                {
                    $.post('/api/saved/' + id + '/save', function (req, res) {
                        console.log(res);
                    });
                    $(this).data('saved', true);
                    $(this).html("<i class='material-icons'>star</i>");
                }
                break;
            case true:
                {
                    $.post('/api/saved/' + id + '/delete', function (req, res) {
                        console.log(res);
                    });
                    $(this).data('saved', false);
                    $(this).html("<i class='material-icons'>star_border</i>");

                }
                break;
            default:
                break;
        }

    });

    //show comments modal
    $('.article').on('click', '.commentsBtn', function (e) {
        let id = $(this).parent().data('article_id');
        $('#addCommentBtn').attr('data-article_id', id);
        $.get('/api/articles/' + id, function (data) {
            let mBody = $('.modal-body');
            if (data.length > 0) {
                for (let c of data) {
                    let comment = $('<div>');
                    comment.append($('<p>').addClass('commentTitle').text(c.title));
                    comment.append($('<p>').addClass('commentBody').text(c.body));
                    comment.append($('<hr>'));
                    mBody.append(comment);
                }
            } else {
                mBody.html('No comments to show!');
            }
            console.log(data);
        });
    });

    $('#addCommentBtn').on('click', function (e) {
        let id = $(this).attr('data-article_id');
        let commentTitle = $('#addCommentTitle').val().trim();
        let commentBody = $('#addCommentBody').val().trim();
        let comment = {
            title: commentTitle,
            body: commentBody
        };
        $.post('/api/articles/' + id, comment, function (result) {
            console.log(result);
        });

    });



}); //END OF document