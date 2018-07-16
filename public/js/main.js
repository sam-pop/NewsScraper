$(function () {

    // auto scrape new articles when the page loads
    $.get('/update', function () {
        console.log('UPDATED articles!');
    });

    // handles the hide/show on mouse over/out of the "save" star buttons
    $('.showOnHover').hide();
    $(document).on('mouseover', '.article', function () {
        $(this).children().show();
    });
    $('.article').on('mouseout', function () {
        $('.showOnHover').hide();
    });

    // add/remove article from "saved-articles"
    $('.article').on('click', '.articleSaveBtn', function (e) {
        let id = $(this).parent().data('article_id');
        let saved = $(this).data('saved');
        $(this).removeClass('showOnHover');
        switch (saved) {
            case false:
                {
                    $.post('/api/saved/' + id + '/save', function (req, res) {
                        console.log(res);
                    });
                    $(this).data('saved', true);
                    $(this).html("<i class='material-icons'>star</i>");
                    $(this).removeClass('showOnHover');
                }
                break;
            case true:
                {
                    $.post('/api/saved/' + id + '/delete', function (req, res) {
                        console.log(res);
                    });
                    $(this).data('saved', false);
                    $(this).html("<i class='material-icons'>star_border</i>");
                    $(this).addClass('showOnHover');
                }
                break;
            default:
                break;
        }

    });

    // show comments modal
    $('.article').on('click', '.commentsBtn', function (e) {
        let id = $(this).parent().data('article_id');
        $('#addCommentBtn').attr('data-article_id', id);
        renderComments(id);
    });

    // add comment from input
    $('#addCommentBtn').on('click', function (e) {
        let id = $(this).attr('data-article_id');
        let commentTitle = $('#addCommentTitle').val().trim();
        let commentBody = $('#addCommentBody').val().trim();
        let comment = {
            title: commentTitle,
            body: commentBody
        };
        $.post('/api/articles/' + id, comment, function () {
            $('#addCommentTitle').val('');
            $('#addCommentBody').val('');
            renderComments(id);
        });

    });

    // remove comment
    $('.modal-body').on('click', '.delCommentBtn', function (e) {
        let id = $(this).attr('data-article_id');
        let commentId = $(this).attr('data-comment_id');
        $.ajax({
            url: '/api/articles/' + id + '/' + commentId,
            type: 'DELETE',
            success: function (data) {
                console.log(data);
            }
        });
        renderComments(id);
    });


}); //END OF document

// renders the comments associated to the article in the modal
function renderComments(id) {
    $.get('/api/articles/' + id, function (data) {
        let mBody = $('.modal-body');
        mBody.empty();
        if (data.length > 0) {
            for (let c of data) {
                let comment = $('<div>');
                comment.append($('<i>').addClass('delCommentBtn material-icons float-right').attr({
                    'data-comment_id': c._id,
                    'data-article_id': id
                }).text('delete_forever'));
                comment.append($('<p>').addClass('commentTitle').html('<b>' + c.title + '</b>'));
                comment.append($('<p>').addClass('commentBody').html('<i>' + c.body + '</i>'));
                comment.append($('<hr>'));
                mBody.append(comment);
            }
        } else {
            mBody.html('No comments to show!');
        }
        console.log(data);
    });
}