
// Date picker and add event modal
$(document).ready(function(){
    $('.datepicker').datepicker();
    $('.modal').modal({
            dismissible: false, // Modal cannot be closed by clicking anywhere outside
        }
    );
    $('select').formSelect();
})

// Price Slider Range
var slider = document.getElementById('priceSlider');
noUiSlider.create(slider, {
    start: [20],
    connect: true,
    step: 50,
    range: {
        'min': 50,
        'max': 1000
    },
    format: wNumb({
        decimals: 0
    })
});

