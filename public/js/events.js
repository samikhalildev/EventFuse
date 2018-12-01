

// API endpoints
const ADD_EVENTS_API = window.location.hostname === 'localhost' ? 'http://localhost:3000/api/addEvents/' : 'http://eventhubz.herokuapp.com/api/addEvents/';
const GET_EVENTS_API = window.location.hostname === 'localhost' ? 'http://localhost:3000/api/company/' : 'http://eventhubz.herokuapp.com/api/company/';

// DOM elements
const addEvent = document.querySelector('#addEventForm');
const userID = document.getElementById('userID').value;

var validateElement = document.getElementById('validation');
var loadingElement = document.getElementById('loadingElement');

var tableElement = document.getElementById('table-data');
var teamDataElement = document.getElementById('teamData');

loadingElement.style.display = 'none';

// Date picker and add event modal
$(document).ready(function(){
    $('.modal').modal({
            dismissible: false, // Modal cannot be closed by clicking anywhere outside
        }
    );
    $('.datepicker').datepicker({
        format: 'dd-mmm-yyyy'
    });

});


// Loads these functions when page loads
window.onload = function(){
    fetchEvents();
}


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
        var success = "Added successfully!";
        DisplayError(success, false);

        // display button
        //document.querySelector('#register-btn-submit').className = 'modal-action button-secondary btn-large disabled left';

        console.log(newEvent);

        var selector = document.querySelector('.selectCompany');
        var companyID = selector.options[selector.selectedIndex].value;

        // USING FETCH TO POST DATA TO THE SERVER USING JSON
        fetch(ADD_EVENTS_API + companyID, {
            method: 'POST',
            body: JSON.stringify(newEvent),
            headers: {
                'content-type': 'application/json'
            }
        }).then(respones => respones.json())
            .then(json => {
                console.log(json);
                addEvent.reset();
                fetchEvents();
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



let selector = document.querySelector('.selectCompany');
selector.addEventListener('change', fetchEvents);


function fetchEvents(){
    var companyID = selector.value;

    if(!companyID)
        return;

    tableElement.style.display = 'none';
    loadingElement.style.display = '';


    fetch(GET_EVENTS_API + companyID)
        .then(response => response.json())
        .then(data => {
            var events = data.company.events;
            var team = data.company.team;
            var success = data.success;

            let table = '';
            var teamData = `<option value="">No one</option>`;

            var id = 1;

            if(events.length == 0){
                table +=
                    `<tr>
                        <td class="alert error-msg"  colspan="9" aria-colspan="9">  You have no events. Click the add event button!</td>
                    </tr>
                    `;
            } else if(success){
                events.forEach((event) => {

                    table += `
                               <tr>
                                    <td scope="row">${id++}</td>
                                    <td class="type"> ${event.type} </td>
                                    <td class="name"> ${event.name}</td>
                                    <td class="date"> ${event.date}</td>
                                    <td class="price"> $${event.price}</td>
                                    <td class="storage"> ${event.storage}</td>
                                    <td class="status">
                                         <button class="button-status ${event.status}">
                                            ${event.status}
                                         </button> 
                                    </td>
                                    <td class="assignedTo"> ${event.assignedTo}</td>
                                    <td class="notes"> ${event.notes}</td>
                                    
                                    <td class=""> 
                                        <a href="/fdsf"> <i class="material-icons prefix edit">edit</i> </a> 
                                    </td>
                                    
                                    <td class=""> 
                                        <a href="#delete-modal"> <i class="material-icons prefix delete modal-trigger">delete</i> </a> 
                                    </td>
                               </tr>
                            `;
                });

            } else if(!success){
                table +=
                    `<tr>
                        <td class="alert error-msg" colspan="9" aria-colspan="9"> There was an error trying to display your events.</td>
                    </tr>
                    `;
            }

            if(success){
                team.forEach((t) => {
                    teamData += `
                                <option value="${t.username}">${t.username}</option>
                            `;
                });
            }

            tableElement.innerHTML = table;
            teamDataElement.innerHTML = teamData;

            $(document).ready(function(){
                $('select').formSelect();
            });

            var options = {
                valueNames: [ 'type', 'name', 'date', 'price', 'storage', 'notes', 'status', 'assignedTo' ]
            };

            var userList = new List('events', options);

            tableElement.style.display = '';
            loadingElement.style.display = 'none';

        })
        .catch(err => console.log(err));

}
