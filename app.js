var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    User          = require("./models/user"),
    seedDB        = require("./seeds")

// Require routes
var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes    = require("./routes/comments"),
    indexRoutes      = require("./routes/index")

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

// Use routes stored in routes directory
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use(indexRoutes);

var PORT = process.env.PORT || 3000;

app.listen(PORT, (req,res) => {
    console.log("Server is listening on port " + PORT);
});