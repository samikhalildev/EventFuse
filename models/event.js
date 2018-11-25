const mongoose = require('mongoose');
const User = require('./user');

// User Schema
const eventSchema = mongoose.Schema({
    type: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        required: true
    },

    assignedTo: {
        type: String
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Event = module.exports = mongoose.model('Event', eventSchema);

// Get events
module.exports.getEvents = function (callback, limit) {
    Event.find(callback).limit(limit);
}

// Get event by ID
module.exports.getEventByID = function (id, callback) {
    Event.findById(id, callback);
}


// Add Event (data from the form)
module.exports.addEvent = function (event, callback) {
    Event.create(event, callback);
}

// Update Event (data from the form)
module.exports.updateEvent = function (id, updatedEvent, callback) {
    var query = {_ID: id};

    var data = {
        type: updatedEvent.type,
        name: updatedEvent.name
    }

    Event.findOneAndUpdate(query, data, callback);
}

// DELETE
module.exports.removeEvent = function (id, callback) {
    var query = {_id: id};
    Event.remove(query, callback);
}