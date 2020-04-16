var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// Root route
router.get("/", (req,res) => {
    res.render("home");
});

// ============
// AUTH ROUTES
// ============

// Show register form
router.get("/register", (req,res) => {
    res.render("users/register");
});

// Handle sign up logic
router.post("/register", (req,res) => {
    var newUser = new User({username: req.body.username});
    // Sign user up
    User.register(newUser, req.body.password, (err,user) => {
        if(err) {
            throw err;
        } else {
            // Log them in
            passport.authenticate("local")(req, res, () => {
                res.redirect("/campgrounds");
            });
        }
    });
});

// Show login form
router.get("/login", (req,res) => {
    res.render("users/login");
});

// Handle login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), (req,res) => {
});

// Logout route
router.get("/logout", (req,res) => {
    req.logout();
    res.redirect("/campgrounds");
});

// Handle undefined routes
router.get("/*", (req,res) => {
    res.render("page-not-found");
})

// Middleware
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;