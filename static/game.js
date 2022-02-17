//jshint esversion:6

const canvasImage = document.getElementById("canvas-image");
const ctxCanvasImage = canvasImage.getContext("2d");
const canvasSnapshot = document.getElementById("canvas-snapshot");
const ctxCanvasSnapshot = canvasSnapshot.getContext("2d");
const video = document.getElementById("video-input");

let currentGameplayData;
let currentSessionId;

let pictureAUs = [];

document.getElementById("new-game-btn").addEventListener("click", startNewGame);
document.getElementById("retry-btn").addEventListener("click", retryGame);

let isRunning = false;

main() // .then(setTimeout(preheatAUDetection, 1000));

async function preheatWebmodels(){
  ctxCanvasSnapshot.drawImage(video, 0, 0, video.width, video.height);
  const snapshot = canvasSnapshot.toDataURL("image/png");
  generateStatus(snapshot, 0, 0, true);
}


// async function preheatAUDetection(){
//   ctxCanvasSnapshot.drawImage(video, 0, 0, video.width, video.height);
//   const snapshot = canvasSnapshot.toDataURL("image/png");
//   requestActionUnits(snapshot, 0, 0, 0, true) 
// }

async function main(){
  getSessionId().then(startWebcam().then(getImageThenStart));
}

async function getImageThenStart(){
  currentGameplayData = await getGameplayData();
  startRound();
}

function changeViewToActiveGame(){
  document.getElementById('new-game-btn').disabled = true;
  document.getElementById('retry-btn').disabled = true;
  document.getElementById("timer").style.display = "block";
  document.getElementById("jaccard-score").style.display = "none";
  document.getElementById("correct-aus").style.display = "none";
  document.getElementById("your-aus").style.display = "none";
  document.getElementById("canvas-snapshot").style.display = "none";
  document.getElementById("video-input").style.display = "inline-block";
}

function changeViewToInactiveGame(){
  document.getElementById("canvas-snapshot").style.display = "inline-block";
  document.getElementById("video-input").style.display = "none";
  document.getElementById('new-game-btn').disabled = false;
  document.getElementById('retry-btn').disabled = false;
}

async function startRound(){
    isRunning = true;
    changeViewToActiveGame()
    setNewImage(`static/faces/${currentGameplayData.imageName}`);
    countdown(5);
}

async function finishRound(){
    changeViewToInactiveGame()
    ctxCanvasSnapshot.drawImage(video, 0, 0, video.width, video.height);
    const snapshot = canvasSnapshot.toDataURL("image/png");
    // console.log("Current Gameplay ID:", currentGameplayData.gameplayId);
    const t0 = performance.now();
    const actionUnitData = requestActionUnits(snapshot, currentGameplayData.gameplayId, currentSessionId, currentGameplayData.imageId, false);
    actionUnitData.then(auData => {
      showScores(auData);
      const t1 = performance.now();
      const timeToComplete = t1 - t0;
      console.log(timeToComplete);

    });
    generateStatus(snapshot, currentGameplayData.gameplayId, currentSessionId, false);
}

function showScores(auData){
  document.getElementById("correct-aus").innerHTML = "Our picture: " + currentGameplayData.actionUnits;
  document.getElementById("correct-aus").style.display = "block"; 
  document.getElementById("timer").style.display = "none";
  document.getElementById("your-aus").innerHTML = "Your picture: " + auData.actionUnits;
  document.getElementById("your-aus").style.display = "block";
  document.getElementById("jaccard-score").innerHTML = "Jaccard Score: " + Math.round(auData.jaccardIndex * 100) + "%";
  document.getElementById("jaccard-score").style.display = "block";
  document.getElementById("retry-btn").style.display = "inline-block";
}

function startNewGame(){
    if (isRunning === false){
      document.getElementById("timer").innerHTML = "Loading new image...";
      getImageThenStart();
    }
}

function countdown(seconds){
    const timerElem = document.getElementById("timer");
    function tick(){
        if (seconds === 0){
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


// function jaccard(auSet1, auSet2){
//   const allAUs = mergeAndDeduplicate(auSet1, auSet2);
//   const intersectionAUList = auSet2.filter(x => auSet1.includes(x));
//   const score = intersectionAUList.length / allAUs.length;
//   return score;
// }

function retryGame(){
  getNewGameplayId(currentGameplayData.imageId);
  startRound();
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

async function getGameplayData(){
    const apiURL = `/api/getGameplayData?sessionId=${currentSessionId}` 
    let res = await fetch(apiURL, {method: "GET"});
    let json = await res.json();
    console.log(json);
    return json;
}

async function requestActionUnits(image, gameplayId, sessionId, goldId, isPreheat){
  const apiURL = "/api/getActionUnits";
  const data = {"base64image": image, "gameplayId": gameplayId, "sessionId": sessionId, "goldId": goldId, "isPreheat": isPreheat};
  let res = await fetch(apiURL, {method: "POST", mode: 'cors',
  headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
  let json = await res.json();
  return json;
}

// async function preheatAUDetector(image, gameplayId, sessionId, goldId){
//   const apiURL = "/api/preheatAUDetector";
//   //const data = {"base64image": image, "gameplayId": gameplayId, "sessionId": sessionId, "goldId": goldId};
//   const data = {}
//   let res = await fetch(apiURL, {method: "POST", mode: 'cors',
//   headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
//   let json = await res.json();
//   return json;
// }

async function sendStatusVector(statusVector, gameplayId, sessionId){
  const apiURL = "/api/uploadOnlineResults";
  const data = {"statusVector": statusVector, "gameplayId": gameplayId, "sessionId": sessionId};
  let res = await fetch(apiURL, {method: "POST", mode: 'cors',
  headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
  return;
}

async function getSessionId(){
  const apiURL = "/api/getSessionId";
  let res = await fetch(apiURL, {method: "GET"});
  await res.json().then(json => {
    // console.log("Session ID: ", json.sessionId);
    currentSessionId = json.sessionId;
  });
}

async function getNewGameplayId(imageId){
  const apiURL = `/api/getNewGameplayId?imageId=${imageId}`;
  let res = await fetch(apiURL, {method: "GET"});
  await res.json().then(json => {
    // console.log("Gameplay ID: ", json.gameplayId)
    currentGameplayData.gameplayId = json.gameplayId;
  });
}

/**
 * startWebcam - Function that starts the webcam and displays it in the "video" object.
 *
 */
 async function startWebcam() {
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
    cameraSelectBox.innerHTML = '<option value="" disabled selected>Choose Webcam</option>';
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

 
