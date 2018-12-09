var loadingElement = document.getElementById('loadingElement');
var loginnregister = document.getElementById('login-register');

loadingElement.style.display = 'none';

// loader for login and register
loginnregister.addEventListener('submit', function() {
    loadingElement.style.display = '';
});

$(document).ready(function(){
    $('.sidenav').sidenav();
});
