var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Campground = require("../models/campground");
var middleware = require("../middleware/");
//INDEX
router.get("/campgrounds", function(req, res){
  Campground.find({}, function(err, allCampgrounds){
    if(err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", {campgrounds: allCampgrounds});
    }
  });
});

//CREATE
router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var price = req.body.price;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var newCamp = {name: name, image: image, description: description, author: author, price:price};
  //campgrounds.push(newCamp);
  //create a new campground and save to db
  Campground.create(newCamp, function(err, newlyCreated){
    if(err){
      console.log(err);
    } else{
      res.redirect("/campgrounds");
    }
  });
});

//NEW - add a campground
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res){
  res.render("campgrounds/new");
});

//Show - shows more info
router.get('/campgrounds/:id', function(req, res){
  //find id
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
    if (err || !foundCamp) {
      req.flash("error", "Campground not found");
      res.redirect("/campgrounds")
    }
    else {
      res.render("campgrounds/show", {campground:foundCamp});
    }
  });
});

//edit campground routes
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
      res.render("campgrounds/edit", {campground: foundCampground});
    });
});
//update
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCamp){
    if (err) {
      res.redirect("/campgrounds");
    } else{
      res.redirect("/campgrounds/"+ req.params.id);
    }
  });
});

//destroy campground
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
  Campground.findByIdAndRemove(req.params.id, function(err){
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;
