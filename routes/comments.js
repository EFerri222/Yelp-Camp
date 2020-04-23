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
    // Grab id of campground from param
    var id = req.params.id;
    // Grab text from form and use id/username of currently logged in user
    var newComment = {
        text: req.body.text,
        author: {
            id: req.user._id,
            username: req.user.username
        }
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

// EDIT ROUTE - show edit form for one comment
router.get("/:commentid/edit", isLoggedIn, isCorrectUser, (req,res) => {
    Campground.findById(req.params.id, (err,campground) => {
        Comment.findById(req.params.commentid, (err,comment) => {
            if(err) {
                throw err;
            } else {
                res.render("comments/edit", {campground: campground, comment: comment});
            }
        });
    })

});

// UPDATE ROUTE - update a particular comment, then redirect to its campground's show page
router.put("/:commentid", isLoggedIn, isCorrectUser, (req,res) => {
    // First argument is id, second is data to use for update
    Comment.findByIdAndUpdate(req.params.commentid, {text: req.body.text}, (err,comment) => {
        if(err) {
            throw err;
        } else {
            comment.save();
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY CONFIRMATION ROUTE - show form that asks user to confirm deleting campground
router.get("/:commentid/delete", isLoggedIn, isCorrectUser, (req,res) => {
    Campground.findById(req.params.id, (err,campground) => {
        if(err) {
            throw err;
        } else {
            Comment.findById(req.params.commentid, (err,comment) => {
                if(err) {
                    throw err;
                } else {
                    res.render("comments/delete", {campground: campground, comment: comment});
                }
            });
        }
    });
});

// DESTROY ROUTE - delete a particular comment, then redirect to its campground's show page
router.delete("/:commentid", isLoggedIn, isCorrectUser, (req,res) => {
    Comment.findByIdAndRemove(req.params.commentid, (err,comment) => {
        if(err) {
            throw err;
        } else {
            res.redirect("/campgrounds/" + req.params.id);
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
    Comment.findById(req.params.commentid, (err, comment) => {
        if(req.user.id === comment.author.id.toString()) {
            return next();
        }
        res.redirect("/");
    })
}

module.exports = router;