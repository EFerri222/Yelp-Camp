var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

// INDEX ROUTE - show all campgrounds
router.get("/", (req,res) => {
    // Retrieve all campgrounds from DB
    Campground.find({}, function(err,campgrounds) {
        if(err) {
            console.log(err);
        } else {
            // Render them to campgrounds page
            res.render("campgrounds/index", {campgrounds: campgrounds});
        }
    });
});

// NEW ROUTE - show form to create new campground
router.get("/new", isLoggedIn, (req,res) => {
    res.render("campgrounds/new");
});

// CREATE ROUTE - add new campground to db
router.post("/", isLoggedIn, (req,res) => {
    // Grab data from form
    var newCampground = req.body.campground;
    // Create new campground and save to DB
    Campground.create(newCampground, function(err,campground) {
        if(err) {
            console.log(err);
        } else {
            // Add currently signed in user to campground
            campground.creator.id = req.user._id;
            campground.creator.username = req.user.username;
            campground.save();
            // Redirect to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

// SHOW ROUTE - shows more info about one campground
router.get("/:id", (req,res) => {
    // Find campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err,campground) {
        if(err) {
            throw err;
        } else {
            // Render show template with that campground
            res.render("campgrounds/show", {campground: campground});
        }
    });
});

// Middleware
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;