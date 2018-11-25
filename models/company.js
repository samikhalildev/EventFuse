const mongoose = require('mongoose');
const Event = require('./event');

// Company Schema
const companySchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    isOwner: {
        type: Boolean,
        required: true
    },

    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    }
});

const Company = module.exports = mongoose.model('Company', companySchema);

