const express = require("express");
const app = express();

const mongoose = require("mongoose");

const { engine } = require("express-handlebars");
const { PORT, MONGODB_URI } = require("./config/config");
const routing = require("./Controller_Router/noteRoutes");
const nSchema = require("./Model/note_schema");

const connectDb = async () => {
  const connection = await mongoose.connect(MONGODB_URI);
};
connectDb();

// ! Handlebars
const Handlebars = require("handlebars");
Handlebars.registerHelper("eq", function (a, b) {
  return a === b;
});

app.engine("handlebars", engine());
app.set("view engine", "handlebars");

// !Middleware
app.use(express.urlencoded({ extended: true }));
app.use("/api", routing);

app.get("/", (req, res) => {
  res.render("home", { title: "Home Page" });
});

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`http://localhost:${PORT}`);
});
