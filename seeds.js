var mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment")

var data = [
    {
        name: "Night at the Teebury",
        image: "https://cdn.pixabay.com/photo/2016/01/19/16/48/teepee-1149402_960_720.jpg",
        description: "What is camping? Baby don't hurt the environment, don't hurt it no more."
    },
    {
        name: "Burn Baby, Burn",
        image: "https://cdn.pixabay.com/photo/2016/11/21/16/03/campfire-1846142_960_720.jpg",
        description: "FEEL THE BURN!!!!"
    },
    {
        name: "Hippie Escape",
        image: "https://cdn.pixabay.com/photo/2016/11/21/14/31/vw-bus-1845719_960_720.jpg",
        description: "Live off the grid for a while, man."
    },
    {
        name: "Victims of Jason",
        image: "https://cdn.pixabay.com/photo/2017/08/06/18/33/barn-2594975_960_720.jpg",
        description: "Don't wander off alone or you'll be sorry!"
    },
    {
        name: "Aurora Borealis",
        image: "https://cdn.pixabay.com/photo/2020/01/11/07/39/north-4756774_960_720.jpg",
        description: "At this time of year, at this time of day, in this part of the country, localized entirely within your campground."
    },
    {
        name: "Luna's Den",
        image: "https://solarsystem.nasa.gov/system/news_items/main_images/944_Blue_Moon_Airplane_1280.jpg",
        description: "Luna, lunita, lunera. Luna llena luna perla. Dime si ella es la reina, y la dueña de todo mi amor <3"
    }
]

function seedDB() {
    // Remove all campgrounds
    Campground.deleteMany({}, function(err) {
        if(err) {
            throw err;
        } else {
            // Remove all comments
            Comment.deleteMany({}, function(err) {
                if(err) {
                    throw err;
                } else {
                    // Add seed data
                    data.forEach(function(seed) {
                        Campground.create(seed, function(err, campground) {
                            if(err) {
                                throw err;
                            } else {
                                Comment.create(
                                    {
                                        text: "This place is great, but I wish there was internet",
                                        author: "Homer"
                                    }, function(err, comment) {
                                        if(err) {
                                            throw err;
                                        } else {
                                            campground.comments.push(comment);
                                            campground.save();
                                        }
                                    }
                                )
                            }
                        })
                    })
                }
            })
        }
    })
}

module.exports = seedDB;