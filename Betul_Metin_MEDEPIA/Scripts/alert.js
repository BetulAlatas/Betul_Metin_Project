application.factory('$alert', function ($ngConfirm) {

    var service = {};

    service.areYouSure = function (callback) {
        $ngConfirm({
            title: 'Emin Misiniz?',
            type: 'red',
            content: 'Yeniden başlamak istediğinize emin misiniz?Mevcut oyun bilgileri kaybolacak.',
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