var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {
    isLoggedIn: function(req, res, next) {
        // Is user logged in?
        if(req.isAuthenticated()) {
            return next();
        }
        req.flash("error", "You must be logged in to do that.");
        res.redirect("/login");
    },
    checkCampgroundOwnership: function(req, res, next) {
        // Is user logged in?
        if(req.isAuthenticated()) {
            Campground.findById(req.params.id, (err, campground) => {
                if(err) {
                    throw err;
                } else {
                    // Did user create campground?
                    if(req.user.id === campground.creator.id.toString()) {
                        return next();
                    } else {
                        req.flash("error", "Permission denied.");
                        res.redirect("back");
                    }
                }
            });
        } else {
            req.flash("error", "You must be logged in to do that.");
            res.redirect("back");
        }  
    },
    checkCommentOwnership: function(req, res, next) {
        // Is user logged in?
        if(req.isAuthenticated()) {
            Comment.findById(req.params.commentid, (err, comment) => {
                if(err) {
                    throw err;
                } else {
                    // Did user create comment?
                    if(req.user.id === comment.author.id.toString()) {
                        return next();
                    } else {
                        req.flash("error", "Permission denied.");
                        res.redirect("back");
                    }
                }
            });
        } else {
            req.flash("error", "You must be logged in to do that.");
            res.redirect("back");
        }
    }
};

module.exports = middlewareObj;