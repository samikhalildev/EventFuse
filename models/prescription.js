var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");

// User Schema
var PrescriptionSchema = mongoose.Schema({

    // stores prescription for that student and can then by the student ID.
    studentid: {
        type: String
    },
    doctor: {
        type: String
    },
    description: {
        type: String
    }
});

var Prescription = (module.exports = mongoose.model("Prescription", PrescriptionSchema));

module.exports.AddPrescription = function(newPrescription, callback) {
    newPrescription.save(callback);
};
