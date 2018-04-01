application.factory('$alert', function ($ngConfirm) {

    var service = {};

    service.areYouSure = function (callback) {
        $ngConfirm({
            title: 'Emin Misiniz?',
            type: 'red',
            content: 'Yeniden başlamak istediğinize emin misinz? Mevcut oyun kaybolacaktır!',
            buttons: {
                confirm: {
                    text: 'Vazgeç'
                },
                up: {
                    text: 'Tamam',
                    action: callback
                }
            }
        });
    }

    return service;
});