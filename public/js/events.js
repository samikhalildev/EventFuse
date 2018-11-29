
// START UP
const addEvent = document.querySelector('#addEventForm');
const API_URL = 'http://localhost:3000/api/addEvents/';
const userID = document.getElementById('userID').value;
var validateElement = document.getElementById('validation');

// Date picker and add event modal
$(document).ready(function(){
    $('.modal').modal({
            dismissible: false, // Modal cannot be closed by clicking anywhere outside
        }
    );
    $('.datepicker').datepicker({
        format: 'dd-mmm-yyyy'
    });
    $('select').formSelect();
});


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
        decimals: 0,
        thousand: '.'
    })
});


// Show price value when changed
slider.noUiSlider.on('update', function(values, handle) {
    var price = slider.noUiSlider.get();
    document.getElementById('price').innerText = price;
});



/*
 When the form is submitted, we grab the inputs and put it in an object then send the data to the server
 */
addEvent.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(addEvent);

    const type = formData.get('type');
    const name = formData.get('name');
    const date = formData.get('date');
    const storage = formData.get('storage');
    const status = formData.get('status');
    const notes = formData.get('notes');
    const price = Number(slider.noUiSlider.get());
    const assignedTo = formData.get('assignedTo');

    // Create a data object to send to our endpoint
    const newEvent = {
        type: type,
        name: name,
        date: date,
        status: status,
        storage: storage,
        price: price,
        notes: notes,
        assignedTo: assignedTo
    };

    // check for validation before making a request to the server
    var isValid = EventValidation(newEvent);

    // Display an error message and return
    if(!isValid){
        var error = "Please fill out all required fields *";
        DisplayError(error, true);

        return false;

        // Send data to the server
    } else {
        var success = "Submitted successfully!";
        DisplayError(success, false);

        // display button
        document.querySelector('#register-btn-submit').className = 'modal-action button-secondary btn-large disabled left';

        console.log(newEvent);

        var selector = document.querySelector('.selectCompany');
        var companyID = selector.options[selector.selectedIndex].value;

        // USING FETCH TO POST DATA TO THE SERVER USING JSON
        fetch(API_URL + companyID, {
            method: 'POST',
            body: JSON.stringify(newEvent),
            headers: {
                'content-type': 'application/json'
            }
        }).then(respones => respones.json())
            .then(json => {
                console.log(json);
                addEvent.reset();
            });
    }



});


function EventValidation(event) {
    return event.type && event.type.toString().trim() !== '' &&
        event.name && event.name.toString().trim() !== '' &&
        event.date && event.date.toString().trim() !== '';
}


function DisplayError(msg, error) {

    if(error)
        validateElement.className = "error-msg";
    else
        validateElement.className = "success-msg";

    validateElement.innerText = msg;
}
