
const createComapny = document.querySelector('#createCompanyForm');
const addTeamMembers = document.querySelector('#addTeamMembersForm');

const API_URL_ADD_COMPANY = 'http://localhost:3000/manager/create';
const API_URL_ADD_TEAM = 'http://localhost:3000/manager/addTeam/';

const userID = document.getElementById('userID').value;
var companyValidateElement = document.getElementById('CompanyValidation');
var memberValidateElement = document.getElementById('MemberValidation');

$(document).ready(function() {
    $('.modal').modal({
            dismissible: false, // Modal cannot be closed by clicking anywhere outside
        }
    );
});

/*
 When the form is submitted, we grab the inputs and put it in an object then send the data to the server
 */

// create company event listener
createComapny.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(createComapny);

    const name = formData.get('name');

    // Create a data object to send to our endpoint
    const newComapny = {
        name: name
    }

    // Display an error message and return
    if(!Validation(name)){
        var error = "Please enter a company name to proceed.";
        DisplayError(error, true);

        return false;

        // Send data to the server
    } else {
        var success = "Company created successfully!\nPlease refresh!";
        CompanyDisplayError(success, false);

        // display button
        document.querySelector('#register-btn-submit').className = 'modal-action button-secondary btn-large disabled left';

        console.log(newComapny);

        // USING FETCH TO POST DATA TO THE SERVER USING JSON
        fetch(API_URL_ADD_COMPANY, {
            method: 'POST',
            body: JSON.stringify(newComapny),
            headers: {
                'content-type': 'application/json'
            }
        }).then(respones => respones.json())
            .then(createdCompany => {
                console.log(createdCompany);
                createComapny.reset();
        });
    }
});


function addTeamMemberButton(btn) {
    var companyID = btn.value;

    // Add members event listener
    addTeamMembers.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(addTeamMembers);

        const name = formData.get('name');

        // Create a data object to send to our endpoint
        const newTeamMember = {
            name: name
        }

        var success = "Company created successfully!\nPlease refresh!";
        MemberDisplayError(success, false);

        // display button
        document.querySelector('#register-btn-submit').className = 'modal-action button-secondary btn-large disabled left';

        console.log(newTeamMember);

        // USING FETCH TO POST DATA TO THE SERVER USING JSON
        fetch(API_URL_ADD_TEAM + companyID, {
            method: 'POST',
            body: JSON.stringify(newTeamMember),
            headers: {
                'content-type': 'application/json'
            }
        }).then(respones => respones.json())
            .then(newTeam => {
                console.log(newTeam);
                addTeamMembers.reset();
            });
    });
}

function Validation(name) {
    return name && name.toString().trim() !== '';
}


function CompanyDisplayError(msg, error) {

    if(error)
        companyValidateElement.className = "error-msg";
    else
        companyValidateElement.className = "success-msg";

    companyValidateElement.innerText = msg;
}


function MemberDisplayError(msg, error) {

    if(error)
        memberValidateElement.className = "error-msg";
    else
        memberValidateElement.className = "success-msg";

    memberValidateElement.innerText = msg;
}
