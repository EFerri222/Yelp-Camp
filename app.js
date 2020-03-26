var express = require("express");
var app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

var campgrounds = [
    {name: "Night at the Teebury", picture: "https://cdn.pixabay.com/photo/2016/01/19/16/48/teepee-1149402_960_720.jpg"},
    {name: "Burn Baby, Burn", picture: "https://cdn.pixabay.com/photo/2016/11/21/16/03/campfire-1846142_960_720.jpg"},
    {name: "Hippie Escape", picture: "https://cdn.pixabay.com/photo/2016/11/21/14/31/vw-bus-1845719_960_720.jpg"},
    {name: "Victims of Jason", picture: "https://cdn.pixabay.com/photo/2017/08/06/18/33/barn-2594975_960_720.jpg"},
    {name: "Aurora Borealis: At This Time of Year, at This Time of Day, in This Part of the Country, Localized Entirely Within Your Campground", picture: "https://cdn.pixabay.com/photo/2020/01/11/07/39/north-4756774_960_720.jpg"}
]

app.get("/", (req,res) => {
    res.render("home");
});

app.get("/campgrounds", (req,res) => {
    res.render("campgrounds", {campgrounds: campgrounds});
});

app.get("/*", (req,res) => {
    res.render("pagenotfound");
})

var PORT = process.env.PORT || 3000;

app.listen(PORT, (req,res) => {
    console.log("Server is listening on port " + PORT);
});