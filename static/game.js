//jshint esversion:6

const canvasImage = document.getElementById("canvas-image");
const ctxCanvasImage = canvasImage.getContext("2d");
const canvasSnapshot = document.getElementById("canvas-snapshot");
const ctxCanvasSnapshot = canvasSnapshot.getContext("2d");
const video = document.getElementById("video-input");

let pictureAUs = [];

document.getElementById("new-game-btn").addEventListener("click", startNewGame);

let isRunning = false;

main();

function main(){

    startWebcam();
    startNewGame();
}

async function startRound(){
    document.getElementById("timer").style.display = "block";
    hideScores();
    showLiveVideo();
    isRunning = true;
    const randomImage = await requestRandomImage();
    document.getElementById("correct-aus").innerHTML = "Our picture: " + randomImage.actionUnits;
    pictureAUs = randomImage.actionUnits;
    console.log(randomImage);
    setNewImage(`static/faces/${randomImage.imageName}`);
    countdown(5);
}

async function finishRound(){
    showSnapshot();
    ctxCanvasSnapshot.drawImage(video, 0, 0, video.width, video.height);
    const snapshot = canvasSnapshot.toDataURL("image/png");
    const actionUnitData = requestActionUnits({base64image: snapshot});
    actionUnitData.then(auData => {
      showScores(auData);
    })
    // console.log(actionUnitData);
}

function startNewGame(){
    if (isRunning === false){
      document.getElementById("timer").innerHTML = "Loading new image...";
      startRound();
    }
}

function countdown(seconds){

    const timerElem = document.getElementById("timer");

    function tick(){
        if (seconds == 0){
            timerElem.innerHTML = "Evaluating Action Units...";
            isRunning = false;
            finishRound();

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

function showLiveVideo(){
  document.getElementById("canvas-snapshot").style.display = "none";
  document.getElementById("video-input").style.display = "inline-block";
}

function showSnapshot(){
  document.getElementById("canvas-snapshot").style.display = "inline-block";
  document.getElementById("video-input").style.display = "none";
}

function showScores(auData){
  document.getElementById("timer").style.display = "none";
  document.getElementById("your-aus").innerHTML = "Your picture: " + auData.actionUnits;
  document.getElementById("your-aus").style.display = "block";
  document.getElementById("correct-aus").style.display = "block"; 
  document.getElementById("jaccard-score").innerHTML = "Jaccard Score: " + Math.round(jaccard(pictureAUs, auData.actionUnits) * 100) + "%";
  document.getElementById("jaccard-score").style.display = "block";
}

function jaccard(auSet1, auSet2){
  const allAUs = mergeAndDeduplicate(auSet1, auSet2);
  const intersectionAUList = auSet2.filter(x => auSet1.includes(x));
  const score = intersectionAUList.length / allAUs.length;
  return score;
}

function mergeAndDeduplicate(arr1, arr2){
  var mergedAndDeduplicated = []
  for (let x of arr1) {
    mergedAndDeduplicated.push(x);
  }
  arr2.forEach(elem => {
    if (mergedAndDeduplicated.includes(elem) == false){
      mergedAndDeduplicated.push(elem);
    }
  });
  return mergedAndDeduplicated;
}

function hideScores(){
  document.getElementById("jaccard-score").style.display = "none";
  document.getElementById("status").style.display = "none";
  document.getElementById("correct-aus").style.display = "none";
  document.getElementById("your-aus").style.display = "none";
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

 
