var express = require("express");
var app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req,res) => {
    res.render("home");
});

app.get("/campgrounds", (req,res) => {
    res.render("campgrounds");
});

app.get("/*", (req,res) => {
    res.send("Error: page not found :(");
})

var PORT = process.env.PORT || 3000;

app.listen(PORT, (req,res) => {
    console.log("Server is listening on port " + PORT);
});