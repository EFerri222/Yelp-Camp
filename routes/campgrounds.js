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

// CREATE ROUTE - add new campground to db, then redirect to /campgrounds
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

// EDIT ROUTE - show edit form for one campground
router.get("/:id/edit", isLoggedIn, isCorrectUser, (req,res) => {
    Campground.findById(req.params.id, (err,campground) => {
        if(err) {
            throw err;
        } else {
            res.render("campgrounds/edit", {campground: campground});
        }
    });
});

// UPDATE ROUTE - update a particular campground, then redirect to that campground's show page
router.put("/:id", isLoggedIn, isCorrectUser, (req,res) => {
    // First argument is id, second is data to use for update
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err,campground) => {
        if(err) {
            throw err;
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY ROUTE - delete a particular campground, then redirect to /campgrounds
router.delete("/:id", isLoggedIn, isCorrectUser, (req,res) => {
    Campground.findByIdAndRemove(req.params.id, (err,campground) => {
        if(err) {
            throw err;
        } else {
            res.redirect("/campgrounds");
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

function isCorrectUser(req, res, next) {
    Campground.findById(req.params.id, (err, campground) => {
        if(req.user.id === campground.creator.id.toString()) {
            return next();
        }
        res.redirect("/");
    })
}

module.exports = router;