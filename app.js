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
app.use(express.static("public"));

seedDB();

app.get("/", (req,res) => {
    res.render("home");
});

// INDEX - show all campgrounds
app.get("/index", (req,res) => {
    // Retrieve all campgrounds from DB
    Campground.find({}, function(err,campgrounds) {
        if(err) {
            console.log(err);
        } else {
            // Render them to campgrounds page
            res.render("index", {campgrounds: campgrounds});
        }
    });
});

// CREATE - add new campground to db
app.post("/campgrounds", (req,res) => {
    // Grab data from form
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {name: name, image: image, description: description};
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

// NEW - show form to create new campground
app.get("/campgrounds/new", (req,res) => {
    res.render("new");
});

// SHOW - shows more info about one campground
app.get("/campgrounds/:id", (req,res) => {
    // Find campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err,campground) {
        if(err) {
            throw err;
        } else {
            // Render show template with that campground
            res.render("show", {campground: campground});
        }
    });
});

app.get("/*", (req,res) => {
    res.render("pagenotfound");
})

var PORT = process.env.PORT || 3000;

app.listen(PORT, (req,res) => {
    console.log("Server is listening on port " + PORT);
});