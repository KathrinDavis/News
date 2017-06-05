//ROUTES previously in server.js
var express = require("express");
var app = express();
var Article = require("../models/article.js");
var Note = require("../models/note.js");
var bodyParser= require("body-parser");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var request = require("request");
mongoose.Promise = global.Promise;

//++++++ for HEROKU
//var uri ="mongodb://heroku....."
// mongoose.connect(uri);

// ===========================================
//db configuration with mongoose; moved from server.js
//mongoose.connect("mongodb://localhost/");
var db = mongoose.connection;
db.on("error", function(error){
	console.log("Mongoose Error: ", error);
});

db.once("open", function(){
	console.log("Mongoose connection successful.");
});

app.get("/", function(req, res){
	res.render("index");
})

//===============================
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

