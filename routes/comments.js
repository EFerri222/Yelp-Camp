var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// NEW ROUTE - Show form to create new comment
router.get("/new", isLoggedIn, (req,res) => {
    // Find campground by id
    Campground.findById(req.params.id, function(err,campground) {
        if(err) {
            throw err;
        } else {
            // Render new comment form for that campground
            res.render("comments/new", {campground:campground});
        }
    });
});

// CREATE ROUTE - Add new comment to campground
router.post("/", isLoggedIn, (req,res) => {
    // Grab id from param
    var id = req.params.id;
    // Grab text from form and use username of currently logged in user
    var newComment = {
        text: req.body.text,
        author: req.user.username
    }
    // Find campground to attach comment to
    Campground.findById(id, function(err,campground) {
        if(err) {
            throw err;
        } else {
            // Create new comment
            Comment.create(newComment, function(err,comment) {
                if(err) {
                    throw err;
                } else {
                    // Add to campground and save to DB
                    campground.comments.push(comment);
                    campground.save();
                    // Redirect to campground show page
                    res.redirect("/campgrounds/" + id);
                }
            })
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