//jshint esversion:6

const hostname = "localhost"

const canvasImage = document.getElementById("canvas-image");
const ctxCanvasImage = canvasImage.getContext("2d");

const canvasSnapshot = document.getElementById("canvas-snapshot");
const ctxCanvasSnapshot = canvasSnapshot.getContext("2d");


const video = document.getElementById("video-input");

document.getElementById("new-game-btn").addEventListener("click", startNewGame);

let isRunning = false;

main();

function main(){
    startWebcam();
    startNewGame();
}

async function startRound(){
    isRunning = true;
    const randomImage = await requestRandomImage();
    console.log(randomImage);
    setNewImage(`faces/${randomImage.imageName}`);
    countdown(3);
    setTimeout(finishRound, 3000);
}

async function finishRound(){
    ctxCanvasSnapshot.drawImage(video, 0, 0, video.width, video.height);
    const snapshot = canvasSnapshot.toDataURL("image/png");
    const actionUnitData = await requestActionUnits({base64image: snapshot});
    // console.log(actionUnitData);
}

function startNewGame(){
    if (isRunning === false){
        startRound();
    }
}

function countdown(seconds){

    const timerElem = document.getElementById("timer");

    function tick(){
        if (seconds < 1){
            timerElem.innerHTML = "SNAP!";
            isRunning = false;
        } else{
            timerElem.innerHTML = seconds;
            seconds -= 1;
            setTimeout(tick, 1000);
        }
    }
    setTimeout(tick, 1000)
}

function setNewImage(imagePath){
    const img = new Image();
    img.src = imagePath;
    img.onload = () => {
        ctxCanvasImage.drawImage(img, 0, 0, canvasImage.width, canvasImage.height);
    }
}

async function requestRandomImage(){
    const apiURL = "/api/getRandomImage"
    let res = await fetch(apiURL, {method: "GET"});
    let json = await res.json();
    return json;
}

async function requestActionUnits(image){
  const apiURL = "/api/getActionUnits";
  const data = {"image": image}
  console.log(data);
  let res = await fetch(apiURL, {method: "post", mode: 'cors',
  headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
  let json = await res.json();
  return json;
}


/**
 * startWebcam - Function that starts the webcam and displays it in the "video" object.
 *
 */
 function startWebcam() {
    const cameraSelectBox = document.getElementById("camera-select-box");
    
    cameraSelectBox.addEventListener('click', event => {
      if (typeof currentStream !== 'undefined') {
        stopMediaTracks(currentStream);
      }
      const videoConstraints = {};
      if (cameraSelectBox.value === '') {
        videoConstraints.facingMode = 'environment';
      } else {
        videoConstraints.deviceId = { exact: cameraSelectBox.value };
      }
      const constraints = {
        video: videoConstraints,
        audio: false
      };
  
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(stream => {
          currentStream = stream;
          video.srcObject = stream;
          return navigator.mediaDevices.enumerateDevices();
        })
        .then(gotDevices)
        .catch(error => {
          console.error(error);
        });
    });

    cameraSelectBox.click() // to start webcam automatically
  
  function gotDevices(mediaDevices) {
    const cameraSelectBox = document.getElementById("camera-select-box");
    cameraSelectBox.innerHTML = '<option value="" disabled selected>Click to change webcam</option>';
    cameraSelectBox.appendChild(document.createElement('option'));
    let count = 1;
    mediaDevices.forEach(mediaDevice => {
      if (mediaDevice.kind === 'videoinput') {
        const option = document.createElement('option');
        option.value = mediaDevice.deviceId;
        const label = mediaDevice.label || `Camera ${count++}`;
        const textNode = document.createTextNode(label);
        option.appendChild(textNode);
        cameraSelectBox.appendChild(option);
      }
    });
  }

  function stopMediaTracks(stream) {
    stream.getTracks().forEach(track => {
      track.stop();
    });
  }
 }

 
