$(function () {

    // add/remove article from "saved-articles"
    $('.articleSaveBtn').on('click', function (e) {
        let id = $(this).data('article_id');
        let saved = $(this).data('saved');
        console.log(saved);
        switch (saved) {
            case false:
                {
                    $.post('/api/saved/' + id + '/save', function (req, res) {
                        console.log(res);
                    });
                    $(this).data('saved', true);
                    $(this).text('-');
                }
                break;
            case true:
                {
                    $.post('/api/saved/' + id + '/delete', function (req, res) {
                        console.log(res);
                    });
                    $(this).data('saved', false);
                    $(this).text('+');
                }
                break;
            default:
                break;
        }

    });

}); //END OF document