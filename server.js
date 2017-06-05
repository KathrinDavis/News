
//Dependencies:
var express = require("express");

var bodyParser = require("body-parser");
var mongoose = require("mongoose");
//?what does morgan do exactly? why do we want it?
var logger = require("morgan");

var app = express();
//models:
var Note = require("./models/note.js");
var Article = require("./models/article.js");

//Scraping tools:
var request = require("request");
var cheerio = require("cheerio");

var PORT = process.env.PORT || 3000;
// Set mongoose to leverage built 
//in JavaScript ES6 Promises
mongoose.Promise = Promise;



// ===========================================
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
	extended:false
}));

// ===========================================
app.use(express.static("public"));

// ===========================================
//db configuration with mongoose; moved to controller.js
// ===========================================
//set handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var routes = require("./controllers/controller.js");
app.use("/", routes);
//moved all routesto controller.js file.

// ===========================================
app.listen(PORT, function(){
	console.log("Running on " + PORT);
});

// ===========================================
//hbs stuff
var articles = [
	{name: "no.1 article", link: "www.google.com"},
	{name: "2nd article", link: "facebook.com"} 
	]
app.get("/", function(req, res){
	res.render("articles", {ics: articles})
})