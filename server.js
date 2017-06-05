
//Dependencies:
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
//?what does morgan do exactly? why do we want it?
var logger = require("morgan");

//models:
var Note = require(".models/note.js");
var Article = require("./models/article.js");

//Scraping tools:
var request = require("request");
var cheerio = require("cheerio");

// Set mongoose to leverage built 
//in JavaScript ES6 Promises
mongoose.Promise = Promise;

//Init express
var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
	extended:false
}));

app.use(express.static("public"));

//db configuration with mongoose
//mongoose.connect("mongodb://localhost/");
var db = mongoose.connection;

//set handlebars
// var exhbs = require("express-handlebars"); 
// app.engine("");

db.on("error", function(error){
	console.log("Mongoose Error: ", error);
});

db.once("open", function(){
	console.log("Mongoose connection successful.");
});


//ROUTES

//GET req to scrape site
app.get("/scrape", function(req, res){
	request("http://www.echojs.com/", function(err, res, html){
		var $ = cheerio.load(html);
		$("article h2").each(function(i, element){
			var result = {};

			result.title = $(this).children("a").text();
			result.link = $(this).children("a").attr("href");

			var entry = new Article(result);

			entry.save(function(err, doc){
				if (err){
					console.log(err);
				}else{
					console.log(doc);
				}
			});
		});
	});
	res.send("scrape complete.");
})

app.get("/articles", function(req, res){
	Article.find({}, function(err, doc){
		if(err){console.log(err);
		}else{
			res.json(doc);
		}
	});
});

app.get("/articles/:id", function (req, res){
	Article.findOne({"_id": req.params.id })
	.populate("note")
	.exec(function(err, doc){
		if (err){
			console.log(err);
		}
		else{
			res.json(doc);
		}
	});
});

app.post("/articles/:id", function(req, res){
	var newNote = new Note(req.body);

	newNote.save(function(err, doc){
		if (err){
			console.log(err);
		}else{
			Article.findOneAndUpdtae({"_id":req.params.id }, {"note": doc._id})
			.exec(function(err, doc){
				if(err){
					console.log(err);
				}else{
					res.send(doc);
				}
			});
		}
	});
});

app.listen(3000, function(){
	console.log("App running on port 3000!");
});