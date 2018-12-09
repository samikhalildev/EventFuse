const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID

// Company Schema
const CompanySchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    team: [{
        username: {
            type: String
        },

        isAdmin: {
            type: Boolean,
            default: false
        },

        isOwner: {
            type: Boolean,
            default: false
        }
    }]
});

const Company = module.exports = mongoose.model('Company', CompanySchema);


// Get company by ID
module.exports.getCompanyById = function (companyID, callback) {
    Company.findById(companyID, callback);
}

// Returns all companies for that user
module.exports.getAllUserCompanies = function (username, callback){

    var query = {
        "team.username" : username
    };

    Company.find(query, callback);
}

// Add Comapny
module.exports.addCompany = function (newCompany, callback) {
    Company.create(newCompany, callback);
}


// Add team member
module.exports.addTeamMember = function (id, newTeamMember, callback) {
    var query = {_id: id};

    Company.findOneAndUpdate(query, {$push: {team: newTeamMember}}, callback);
}


// DELETE
module.exports.removeCompany = function (id, callback) {
    var query = {_id: id};
    Company.remove(query, callback);
}



////////////////////////////////////////////////



module.exports.getEventt = function (type, name, callback){

    var query = {
        "events.type" : type,
        "events.name" : name
    };

    Company.find(query, {events: {$elemMatch: {type: type}}}, callback);

}

// GET all events where status is complete
module.exports.getAllCompletedEvents = function (username, callback){

    var query = {
        "events.status" : "Complete"
    };

    Company.find(query, callback);
}


// Get an event
module.exports.getEvent = function (eventID, callback) {

    var query = {
        "events.eventID" : eventID
    };

    Company.findById(query, callback);
}


module.exports.updateEvent = function(company, updateEvent, callback) {

    var query = {
        "events.type": updateEvent.type,
        "events.name": updateEvent.name,
        "events.date": updateEvent.date,
        "events.status": updateEvent.status,
        "events.storage": updateEvent.storage,
        "events.price": updateEvent.price,
        "events.notes": updateEvent.notes,
        "events.assignedTo": updateEvent.assignedTo
    };

    company.findOneAndUpdate({"events.eventID": updateEvent.eventID}, query, callback);

    //User.findOneAndUpdate({ _id: eventID }, query, { new: true }, callback);
};

