var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground    = require("./models/campground"),
    Comment       = require("./models/comment"),
    User          = require("./models/user"),
    seedDB        = require("./seeds")

mongoose.connect('mongodb://localhost:27017/YelpCamp', {useNewUrlParser: true, useUnifiedTopology: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
// ___dirname - start from the name of the directory that this script lives in
app.use(express.static(__dirname + "public"));

seedDB();

// PASSPORT CONFIG
app.use(require("express-session")({
    secret: "Neck of O crehzeh ghee",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Pass req.user into every route as currentUser for any ejs templates that need to be rendered
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

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

// ================
// COMMENTS ROUTES
// ================

// Show form to create new comment
app.get("/campgrounds/:id/comments/new", isLoggedIn, (req,res) => {
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
app.post("/campgrounds/:id/comments", isLoggedIn, (req,res) => {
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

// ============
// AUTH ROUTES
// ============

// Show register form
app.get("/register", (req,res) => {
    res.render("users/register");
});

// Handle sign up logic
app.post("/register", (req,res) => {
    var newUser = new User({username: req.body.username});
    // Sign user up
    User.register(newUser, req.body.password, (err,user) => {
        if(err) {
            throw err;
        } else {
            // Log them in
            passport.authenticate("local")(req, res, () => {
                res.redirect("/index");
            });
        }
    });
});

// Show login form
app.get("/login", (req,res) => {
    res.render("users/login");
});

// Handle login logic
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/index",
        failureRedirect: "/login"
    }), (req,res) => {
});

// Logout route
app.get("/logout", (req,res) => {
    req.logout();
    res.redirect("/index");
});

// Handle undefined routes
app.get("/*", (req,res) => {
    res.render("page-not-found");
})

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

var PORT = process.env.PORT || 3000;

app.listen(PORT, (req,res) => {
    console.log("Server is listening on port " + PORT);
});