//jshint esversion:6

const path = require('path');
const fs = require('fs');

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

function getActionUnits(imageName){
    // PROTOTYPE
    const actionUnits = [1, 2, 3, 4];
    return actionUnits
}

module.exports = {
    getRandomImage
}