var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var path = require("path");

'use strict';
const nodemailer = require("nodemailer");

var Company = require("../models/company");
var Event = require("../models/event");
var User = require("../models/user");
var emailTemplate = require(".//email/teamEmail");

router.get("/", ensureAuthenticated, function(req, res) {

    Company.getAllUserCompaniesByID(user._id, function (err, companies) {

       if(err)
           throw err;

        res.render("manager", {companies: companies});
        console.log(companies);
    });
});


router.post("/create", ensureAuthenticated, function (req, res) {

    var newCompany = new Company({
        name: req.body.name,
        team: {
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            isOwner: true,
            isAdmin: true
        }
    });

    Company.addCompany(newCompany, function (err, company) {

        if(err){
            console.log("An error occured: " + err);
            res.status(404);
            res.json({success: false});

        } else {
            User.addCompanyToUser(user._id, company._id, function (err, companyAdded) {
                if(err)
                    throw err;

                res.json({
                    success: true,
                    company: company
                });

            });
        }

    });

});


router.post("/addTeam/:_id", ensureAuthenticated, function (req, res) {

    var companyID = req.params._id;
    var email = req.body.email;
    var teamMemberID = mongoose.Types.ObjectId();
    console.log(teamMemberID);

    var newTeamMember = {
        "_id": teamMemberID,
        "email": email,
        "isOwner": false,
        "isAdmin": true
    };

    var newUser = new User ({
       _id: teamMemberID,
       email: email
    });

    User.createUser_invite(newUser, function (err, userAdded) {

        if(err)
            throw err;

        User.addCompanyToUser(userAdded._id, companyID, function (err, companyAdded) {

            if(err)
                throw err;

        });

        Company.addTeamMember(companyID, newTeamMember, function (err, company) {

            if(err){
                console.log("An error occured: " + err);
                res.status(404);
                res.json({success: false});

            } else {

                var link = "http://localhost:3000/users/invite/" + userAdded._id;

                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    secure: false,
                    port: 25,
                    auth: {
                        user: 'oventshub@gmail.com',
                        pass: 'F32k041-14<$!<$L'
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });

                // Message object
                let message = {
                    from: '"EventHub" <oventshub@gmail.com>',
                    to: email,
                    subject: user.name + ' has invited you to join ' + company.name + ' on EventHub!',
                    html: emailTemplate(user.name, company.name, link)
                };

                transporter.sendMail(message, (err, info) => {
                    if (err) {
                        console.log('Error occurred. ' + err.message);
                        return process.exit(1);
                    }

                    console.log('Message sent: %s', info.messageId);
                    // Preview only available when sending through an Ethereal account
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                });

                res.json({
                    success: true,
                    email: "sent",
                    company: company
                });
            }

        });

    });

});


function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('error_msg','You are not logged in 🔑');
		res.redirect('/users/login');
	}
}

module.exports = router;
