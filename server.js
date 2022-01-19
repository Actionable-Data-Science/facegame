//jshint esversion:6

const express = require("express");
const api = require("./src/api.js");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
server = app.listen(80);

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/api/getRandomImage", (req, res) => {
    const randomImage = api.getRandomImage();
    console.log(`API Request: getRandomImage => ${randomImage}`)
    res.send(randomImage)
});

