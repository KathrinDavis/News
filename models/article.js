var mongoose = require("mongoose");

var Schema = mongooose.Schema;

var ArticleSchema = new Schema({
	title: {
		type: String,
		required: true
	},

	link: {
		type: String,
		required: true
	},

	photo: {
		//href for photo
		type: String,
		required: false
	},
	bylines: {
		type: String,
		required: false
	}
	note: {
		type:schema.Types.ObjectId,
		ref: "Note"
	}
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;