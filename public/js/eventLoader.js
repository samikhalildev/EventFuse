// dashboard page loader
document.addEventListener("DOMContentLoaded", function(){
    $('.preloader-background').delay(1500).fadeOut('slow');
    $('.preloader-wrapper').delay(1500).fadeOut();
});


// search loading bar
var search = document.getElementById('search');
var searchLoading = document.getElementById('loadingSearchElement');
searchLoading.style.display = 'none';

search.addEventListener("keyup", function(){
    searchLoading.style.display = '';

    setTimeout(function () {
        searchLoading.style.display = 'none';

    },1500);

});
