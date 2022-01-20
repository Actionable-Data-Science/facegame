//jshint esversion:6

const path = require('path');
const fs = require('fs');
const {spawn} = require('child_process');
const { join } = require('path/posix');
const fileExists = require('file-exists-promise');

const imagePath = path.join(__dirname, '../public/faces');

const auData = require(path.join(__dirname, '../public/faces/au_data.json'));

function getRandomImage(){
    const imageName = getRandomImageName();
    const actionUnits = lookupActionUnits(imageName);
    return {imageName: imageName, actionUnits: actionUnits};
};

function getRandomImageName(){
    const imageNames = fs.readdirSync(imagePath, {withFileTypes: true})
    .filter(item => !item.isDirectory())
    .map(item => item.name);
    const imageName = imageNames[Math.floor(Math.random()*imageNames.length)];
    return imageName
}

function getActionUnits(image, res){
    const data = image.replace(/^data:image\/png;base64,/, "");
    const time = new Date().getTime();
    fs.writeFile(path.join(__dirname, `../participant-images/${time}.png`), data, "base64", function(err){
        // console.log(err);
    });
    
    const imagePath = path.join(__dirname, `/participant-images/${time}.png`);

    ls  = spawn(`${path.join(__dirname, "../src/au_detection/env/bin/python")}`, 
        ['-u', `${path.join(__dirname, "../src/au_detection/main.py")}`, 
        imagePath]);
            
    ls.stdout.on('data', function (data) {
        actionUnitsString = data.toString();
        const actionUnits = [];
        actionUnitsString.split(" ").forEach((actionUnit) => {
            actionUnits.push(parseInt(actionUnit));
        });
        if (!res.headersSent){
            res.send(JSON.stringify({au: actionUnits}));
            console.log("AUs:", actionUnits);
        }
    });
            
    ls.stderr.on('data', function (data) {
        console.log('stderr: ' + data.toString());
    });
            
    ls.on('exit', function (code) {
        // console.log('child process exited with code ' + code.toString());
    });    
}
    
function lookupActionUnits(imageName){
    return auData[imageName];
}

module.exports = {
    getActionUnits,
    getRandomImage
}