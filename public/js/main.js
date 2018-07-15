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


    });

}); //END OF document