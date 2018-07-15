$(function () {

    // add/remove article from "saved-articles"
    $('.article').on('click', '.articleSaveBtn', function (e) {
        console.log($(this).parent());
        let id = $(this).parent().data('article_id');
        let saved = $(this).data('saved');
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