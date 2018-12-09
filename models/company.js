const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID

// Company Schema
const CompanySchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    team: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },

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
    }],

    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }]

});

const Company = module.exports = mongoose.model('Company', CompanySchema);


// Get company by ID
module.exports.getCompanyById = function (companyID, callback) {
    Company.findById(companyID, callback);
}

module.exports.addEventToCompany = function (companyID, eventID, callback) {
    var query = {_id: companyID};
    Company.findOneAndUpdate(query, {$push: {events: eventID}}, callback);
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



module.exports.getEvent = function (companyID, eventID, callback){

    var query = {
        _id: companyID
    };

    Company.find(query, {events: {$elemMatch: {_id: eventID}}}, callback);
}

// GET all events where status is complete
module.exports.getAllCompletedEvents = function (username, callback){

    var query = {
        "events.status" : "Complete"
    };

    Company.find(query, callback);
}

module.exports.removeEventFromCompany = function (companyID, eventID, callback) {
    var query = {_id: companyID};
    Company.findOneAndUpdate(query, {$pull: {events: eventID}}, callback);
};

