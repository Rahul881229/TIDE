(function () {
    $('.t-slider').on('input', (e) => {
        // $('.t-slider').on('input', function (e) {
        var min = e.target.min, max = e.target.max, val = e.target.value;
        $(e.target).css({
            'backgroundSize': (val - min) * 100 / (max - min) + '% 100%'
        });
    }).trigger('input');
}).call(this, {});
