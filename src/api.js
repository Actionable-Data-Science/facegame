//jshint esversion:6

const path = require('path');
const fs = require('fs');
const {spawn} = require('child_process')

const imagePath = path.join(__dirname, '../public/faces');

function getRandomImage(){
    const imageName = getRandomImageName();
    const actionUnits = getActionUnits(imageName);
    return {imageName: imageName, actionUnits: actionUnits};
};

function getRandomImageName(){
    const imageNames = fs.readdirSync(imagePath, {withFileTypes: true})
    .filter(item => !item.isDirectory())
    .map(item => item.name);
    const imageName = imageNames[Math.floor(Math.random()*imageNames.length)];
    return imageName
}

function getActionUnits(image){
    const data = image.replace(/^data:image\/png;base64,/, "");
    const time = new Date().getTime();
    fs.writeFile(`./participant-images/${time}.png`, data, "base64", function(err){
        console.log(err);
    });
    calculateActionUnits(`./participant-images/${time}.png`)

    // From here, run action unit detection on the picture, return the results

    const actionUnits = [1, 2, 4];
    return actionUnits
}

function calculateActionUnits(imagePath){
    var process = spawn('python', [
       "-u",
       path.join(__dirname, 'main.py'), 
       imagePath]);
    process.stdout.on('data', function(data) {
        console.log(data.toString());
    });
}

module.exports = {
    getActionUnits,
    getRandomImage
}