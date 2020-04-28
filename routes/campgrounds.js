var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

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
router.get("/new", middleware.isLoggedIn, (req,res) => {
    res.render("campgrounds/new");
});

// CREATE ROUTE - add new campground to db, then redirect to /campgrounds
router.post("/", middleware.isLoggedIn, (req,res) => {
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
            // Send flash message
            req.flash("success", "Campground created!");
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

// EDIT ROUTE - show edit form for one campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req,res) => {
    Campground.findById(req.params.id, (err,campground) => {
        if(err) {
            throw err;
        } else {
            res.render("campgrounds/edit", {campground: campground});
        }
    });
});

// UPDATE ROUTE - update a particular campground, then redirect to that campground's show page
router.put("/:id", middleware.checkCampgroundOwnership, (req,res) => {
    // First argument is id, second is data to use for update
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err,campground) => {
        if(err) {
            throw err;
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY CONFIRMATION ROUTE - show form that asks user to confirm deleting campground
router.get("/:id/delete", middleware.checkCampgroundOwnership, (req,res) => {
    Campground.findById(req.params.id, (err,campground) => {
        if(err) {
            throw err;
        } else {
            res.render("campgrounds/delete", {campground: campground});
        }
    });
});

// DESTROY ROUTE - delete a particular campground, then redirect to /campgrounds
router.delete("/:id", middleware.checkCampgroundOwnership, (req,res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if(err) {
            throw err;
        } else {
            req.flash("success", "Campground removed!");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;