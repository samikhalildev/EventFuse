

// API endpoints
const ADD_EVENTS_API = window.location.hostname === 'localhost' ? 'http://localhost:3000/api/addEvents/' : 'http://eventhubz.herokuapp.com/api/addEvents/';
const GET_EVENTS_API = window.location.hostname === 'localhost' ? 'http://localhost:3000/api/company/' : 'http://eventhubz.herokuapp.com/api/company/';
const Delete_Event_API = window.location.hostname === 'localhost' ? 'http://localhost:3000/edit/delete/' : 'http://eventhubz.herokuapp.com/edit/delete/';

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
        format: 'dd-mmm-yyyy',
        autoClose: true,
        yearRange: [2014, 2019],
        showClearBtn: true
    });
    $('.sidenav').sidenav();
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


function fetchEvents(deleteMessageSuccess){
    var companyID = selector.value;

    if(!companyID)
        return;

    tableElement.style.display = 'none';
    loadingElement.style.display = '';


    fetch(GET_EVENTS_API + companyID)
        .then(response => response.json())
        .then(data => {

            var events = data.events;
            console.log(events);

            var team = data.company.team;
            console.log(team);

            var success = data.success;

            let table = '';
            var teamData = `<option value="">No one</option>`;

            var id = 1;

            if(events.length == 0){
                table +=
                    `<tr>
                        <td class="alert small error-msg"  colspan="9" aria-colspan="9"> Oh no! You have no events. <br> Click the add event button 📸</td>
                    </tr>
                    `;
            } else if(success){
                events.forEach((event) => {
                    var status = '';

                    if(event.status == "Missing-Song-info") {
                        status = "Missing";

                    } else if(event.status == "Waiting") {
                        status = "Ready";

                    } else {
                        status = event.status;
                    }

                        table += `
                               <tr id="${data.company._id}%${event.type}%${event.name}%${event.date}">
                                    <td scope="row">${id++}</td>
                                    <td class="type"> ${event.type} </td>
                                    <td class="name"> ${event.name}</td>
                                    <td class="date"> ${event.date}</td>
                                    <!--<td class="price"> $${event.price}</td>-->
                                    <td class="status">
                                         <button class="button-status ${status}">
                                            ${status}
                                         </button> 
                                    </td>
                                    <td class="storage"> ${event.storage}</td>
                                    <td class="notes"> ${event.notes}</td>
                                    <td class="assignedTo"> ${event.assignedTo}</td>
                                    <input name="eventID" id="eventID" type="hidden" value="${event._id}">
                                    <td class=""> 
                                        <a href="/edit/${event.type}/${event.name}/${event.date}" onclick="showUpdateData(this)"> <i class="material-icons prefix edit">edit</i> </a> 
                                    </td>
                                    
                                    <td class=""> 
                                        <a class="modal-trigger" onclick="deleteEvent(this)"> <i class="material-icons prefix delete modal-trigger deleteEventBtn">delete</i> </a> 
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

            if(deleteMessageSuccess != undefined){
                var message = "";

                var ele = document.querySelector('#deleteMessage');

                console.log(ele);

                if(deleteMessageSuccess){
                    message = "Event was successfully deleted.";
                    ele.className = "alert success-msg";
                    ele.innerText = message;

                } else {
                    message = "Failed to delete event.";
                    ele.className = "alert error-msg";
                    ele.innerText = message;
                }
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

function updateEvent(eventID, id) {
    var actualEventID = eventID[--id].value;
    var data = document.getElementById(actualEventID);

    console.log(data.attributes["update_name"].value);
    // Create a data object to send to our endpoint
}

function deleteEvent(element) {
    var row = element.parentNode.parentNode;
    var eventData = row.id;

    console.log(eventData);

    if (confirm("Are you sure you want to delete this event?")) {

        // split data by percent sign then pass them to the endpoint as parameters
        var data = eventData.split('%');

        let companyID = data[0];
        let type = data[1];
        let name = data[2];
        let date = data[3];

        fetch(Delete_Event_API + companyID + "/" + type + "/" + name + "/" + date)
            .then(respones => respones.json())
            .then(data => {
                let success = data.success;
                fetchEvents(success);
            });

    } else {
        console.log("cancel");
    }}
