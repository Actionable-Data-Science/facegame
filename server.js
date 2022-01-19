//jshint esversion:6


const bodyparser = require('body-parser')
const express = require("express");
const { restart } = require("nodemon");

const api = require("./src/api.js");

const app = express();

app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.json({limit:'1mb'}))
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

app.post("/api/getActionUnits", (req, res) => {
    const image = req.body.image.base64image;
    const actionUnits = api.getActionUnits(image)
    res.send(JSON.stringify({au: actionUnits}))
});

app.post("/api/uploadData", (req, res) => {
    // TO BE IMPLEMENTED
});

