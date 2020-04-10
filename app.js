var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    seedDB = require("./seeds")

mongoose.connect('mongodb://localhost:27017/YelpCamp', {useNewUrlParser: true, useUnifiedTopology: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
// Start from the name of the directory that this script lives in
app.use(express.static(__dirname + "public"));

seedDB();

app.get("/", (req,res) => {
    res.render("home");
});

// INDEX ROUTE - show all campgrounds
app.get("/index", (req,res) => {
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
app.get("/campgrounds/new", (req,res) => {
    res.render("campgrounds/new");
});

// CREATE ROUTE - add new campground to db
app.post("/campgrounds", (req,res) => {
    // Grab data from form
    var newCampground = req.body.campground;
    // Create new campground and save to DB
    Campground.create(newCampground, function(err,campground) {
        if(err) {
            console.log(err);
        } else {
            // Redirect to campgrounds page
            res.redirect("/index");
        }
    });
});

// SHOW ROUTE - shows more info about one campground
app.get("/campgrounds/:id", (req,res) => {
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

// =====================
// COMMENTS ROUTES
// =====================

// Show form to create new comment
app.get("/campgrounds/:id/comments/new", (req,res) => {
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

// Add new comment to campground
app.post("/campgrounds/:id/comments", (req,res) => {
    // Grab id from param
    var id = req.params.id;
    // Grab data from form
    var newComment = req.body.comment;
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

app.get("/*", (req,res) => {
    res.render("page-not-found");
})

var PORT = process.env.PORT || 3000;

app.listen(PORT, (req,res) => {
    console.log("Server is listening on port " + PORT);
});