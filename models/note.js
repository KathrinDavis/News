var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NoteSchema = new Schema({
	title: { type: String },
	body: { type: String }
});

// Remember, Mongoose will automatically save the ObjectIds of the notes
// These ids are referred to in the Article model

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;
