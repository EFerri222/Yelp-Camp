var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

var campgrounds = [
    {name: "Night at the Teebury", image: "https://cdn.pixabay.com/photo/2016/01/19/16/48/teepee-1149402_960_720.jpg"},
    {name: "Burn Baby, Burn", image: "https://cdn.pixabay.com/photo/2016/11/21/16/03/campfire-1846142_960_720.jpg"},
    {name: "Hippie Escape", image: "https://cdn.pixabay.com/photo/2016/11/21/14/31/vw-bus-1845719_960_720.jpg"},
    {name: "Victims of Jason", image: "https://cdn.pixabay.com/photo/2017/08/06/18/33/barn-2594975_960_720.jpg"},
    {name: "Aurora Borealis: At This Time of Year, at This Time of Day, in This Part of the Country, Localized Entirely Within Your Campground", image: "https://cdn.pixabay.com/photo/2020/01/11/07/39/north-4756774_960_720.jpg"}
]

app.get("/", (req,res) => {
    res.render("home");
});

app.get("/campgrounds", (req,res) => {
    res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", (req,res) => {
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
    campgrounds.push(newCampground);
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", (req,res) => {
    res.render("new");
});

app.get("/*", (req,res) => {
    res.render("pagenotfound");
})

var PORT = process.env.PORT || 3000;

app.listen(PORT, (req,res) => {
    console.log("Server is listening on port " + PORT);
});