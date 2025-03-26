const { Schema, model } = require("mongoose");

const NoteSchema = new Schema({
  noteId: { type: String, required: true, unique: true },
  noteName: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true },
});

module.exports = model("Notes", NoteSchema, "Notes");
