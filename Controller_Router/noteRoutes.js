const { Router } = require("express");

const NoteSchema = require("../Model/note_schema");
const router = Router();
const fs = require("fs");

//? Styles
router.get("/styles", (req, res) => {
  fs.readFile("public/style.css", (err, data) => {
    if (err) throw err;
    res.send(data);
  });
});

//? Add Note
router.get("/addNote", (req, res) => {
  res.render("NoteApp/addNote", { title: "Add Note", error: null });
});
router.post("/addNote", async (req, res) => {
  const { noteId, noteName, description, status } = req.body;
  const isEmpty = Object.values(req.body).some((value) => value === "");
  let isDuplicate = false;
  if (
    (await NoteSchema.findOne({
      $or: [
        { noteId: noteId },
        { noteName: noteName },
        { description: description },
      ],
    })) !== null
  ) {
    isDuplicate = true;
  }

  if (isEmpty) {
    res.render("NoteApp/addNote", {
      title: "Add Note",
      error: "All fields are required!",
    });
  } else if (isEmpty || isDuplicate) {
    res.render("NoteApp/addNote", {
      title: "Add Note",
      error: "Duplicate Field Values",
    });
  } else {
    await NoteSchema.create(req.body);
    res.redirect("/", 302, {});
  }
});

//? All Notes
router.get("/allNotes", async (req, res) => {
  const payload = await NoteSchema.find().lean();
  res.render("NoteApp/allNotes", { title: "All Notes", payload });
});

//? Single Note
router.get("/:id", async (req, res) => {
  const payload = await NoteSchema.findOne({ _id: req.params.id }).lean();
  res.render("NoteApp/singleNote", { title: "Single Note", payload });
});

//? Edit Note
router.get("/edit/:id", async (req, res) => {
  const payload = await NoteSchema.findOne({ _id: req.params.id }).lean();
  res.render("NoteApp/editNote", { title: "Edit Note", payload });
});
router.post("/edit/:id", async (req, res) => {
  const payload = await NoteSchema.findOne({ _id: req.params.id });
  payload.noteId = req.body.noteId;
  payload.noteName = req.body.noteName;
  payload.description = req.body.description;
  payload.status = req.body.status;

  await payload.save();
  res.redirect("/api/allNotes", 302, {});
});

//? Delete Note
router.get("/delete/:id", async (req, res) => {
  await NoteSchema.deleteOne({ _id: req.params.id });
  res.redirect("/api/allNotes", 302, {});
});

module.exports = router;
