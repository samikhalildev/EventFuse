var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var path = require("path");

var Company = require("../models/company");
var Event = require("../models/event");
var User = require("../models/user");

router.get("/", ensureAuthenticated, function(req, res) {

    User.findById({_id: user._id})
        .populate("companies")
        .exec()
        .then(data => {
            res.render("manager", {
                companies: data.companies,
            });

            //console.log(data);
        })
        .catch(err => console.log(err));
});


router.post("/create", ensureAuthenticated, function (req, res) {

    var newCompany = new Company({
        name: req.body.name,
        team: {
            username: user.username,
            isAdmin: true,
            isOwner: true
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

    var newTeamMember = {"username": req.body.name, "isAdmin": true, "isOwner": false};
    var companyID = req.params._id;

    Company.addTeamMember(companyID, newTeamMember, function (err, company) {

        if(err){
            console.log("An error occured: " + err);
            res.status(404);
            res.json({success: false});
        }

        res.json({
            success: true,
            company: company
        });

        //console.log("Team member added: " + company);

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
