//jshint esversion:6

const canvasImage = document.getElementById("canvas-image");
const ctxCanvasImage = canvasImage.getContext("2d");
const canvasSnapshot = document.getElementById("canvas-snapshot");
const ctxCanvasSnapshot = canvasSnapshot.getContext("2d");
const canvasHeatmap = document.getElementById("canvas-heatmap");
const ctxCanvasHeatmap = canvasHeatmap.getContext("2d");
const video = document.getElementById("video-input");

let currentGameplayData;
let currentSessionId;
let currentStatus;

let currentStream;
let videoWidth;
let videoHeight;

document.getElementById("new-game-btn").addEventListener("click", startNewGame);
document.getElementById("retry-btn").addEventListener("click", retryGame);

let isRunning = false;

main()

async function preheatWebmodels() {
  ctxCanvasSnapshot.drawImage(video, 0, 0, video.width, video.height);
  const snapshot = canvasSnapshot.toDataURL("image/png");
  generateStatus(snapshot, 0, 0, true);
}

async function main() {
  startWebcamChooser();
  getSessionId().then(sessionId => loadModels()).then(models => preheatWebmodels()).then(getImageThenStart());
}

async function getImageThenStart() {
  currentGameplayData = await getGameplayData();
  startRound();
}

function showVideoOnCanvas() {
  var canvasVideo = document.getElementById("canvas-video");
  var ctxCanvasVideo = canvasVideo.getContext("2d");

  console.log(`CAM: w: ${videoWidth}, h: ${videoHeight}`);

  const ratio = videoWidth / videoHeight;
  const targetWidth = videoWidth / ratio;
  const targetHeight = videoHeight / ratio;
  const y = (canvasVideo.height - targetHeight) / 2;
  const x = (canvasVideo.width - targetWidth) / 2;

  console.log(`TARGET: w: ${targetWidth}, h: ${targetHeight}`);
  console.log(`CAM: x-Offset: ${x}, y-Offset: ${y}, ratio: ${ratio}`);

  video.addEventListener("play", update());
  ctxCanvasVideo.scale(-1, 1);
  function update() {
    ctxCanvasVideo.translate(ctxCanvasVideo.width, 0);

    ctxCanvasVideo.drawImage(video, x * -1, y, targetWidth * -1, targetHeight);
    requestAnimationFrame(update);
  }
}

// function showVideoOnCanvas(){

//   const canvasVideo = document.getElementById("canvas-video")
//   const ctxCanvasVideo = canvasVideo.getContext("2d");
//   const ratio = Math.min(videoWidth / canvasVideo.width, videoHeight / canvasVideo.height);

//   console.log(`CAM: w: ${videoWidth}, h: ${videoHeight}, ratio: ${ratio}`)

//   video.addEventListener('play', function () {
//     var $this = this; //cache
//     (function loop() {
//         if (!$this.paused && !$this.ended) {
//             ctxCanvasVideo.drawImage($this, 0, 0, video.width * ratio, video.height * ratio);
//             setTimeout(loop, 1000 / 30); // drawing at 30fps
//         }
//     })();
// }, 0);
// }

function changeViewToActiveGame() {
  document.getElementById("error-msg").style.display = "none";
  document.getElementById('canvas-heatmap').style.display = "none";
  document.getElementById('new-game-btn').disabled = true;
  document.getElementById('retry-btn').disabled = true;
  document.getElementById("timer").innerHTML = "";
  document.getElementById("timer").style.display = "block";
  document.getElementById("jaccard-score").style.display = "none";
  document.getElementById("correct-aus").style.display = "none";
  document.getElementById("your-aus").style.display = "none";
  document.getElementById("canvas-snapshot").style.display = "none";
  document.getElementById("canvas-video").style.display = "inline-block";
}

function changeViewToInactiveGame() {
  document.getElementById("canvas-snapshot").style.display = "inline-block";
  document.getElementById('canvas-heatmap').style.display = "inline";
  document.getElementById("canvas-video").style.display = "none";
  document.getElementById('new-game-btn').disabled = false;
  document.getElementById('retry-btn').disabled = false;
}

async function startRound() {
  isRunning = true;
  heat.clear();
  ctxCanvasHeatmap.clearRect(0, 0, canvasHeatmap.width, canvasHeatmap.height);
  changeViewToActiveGame()
  setNewImage(`static/faces/${currentGameplayData.imageName}`);
  countdown(5);
}

async function finishRound() {
  changeViewToInactiveGame()
  const canvasVideo = document.getElementById("canvas-video");
  ctxCanvasSnapshot.drawImage(canvasVideo, 0, 0);
  const snapshot = canvasSnapshot.toDataURL("image/png");
  // console.log("Current Gameplay ID:", currentGameplayData.gameplayId);
  const t0 = performance.now();
  const actionUnitData = requestActionUnits(snapshot, currentGameplayData.gameplayId, currentSessionId, currentGameplayData.imageId, false);
  actionUnitData.then(auData => {
    showScores(auData);
    showHeatmap(currentGameplayData.actionUnits, auData.actionUnits, canvasSnapshot);

    const t1 = performance.now();
    const timeToComplete = t1 - t0;
    console.log("Time between image sent and AUs received: ", timeToComplete, "ms");

  });
  generateStatus(snapshot, currentGameplayData.gameplayId, currentSessionId, false);
}

function showScores(auData) {
  document.getElementById("timer").style.display = "none";
  if (auData.success) {
    document.getElementById("correct-aus").innerHTML = "Our picture: " + currentGameplayData.actionUnits;
    document.getElementById("correct-aus").style.display = "block";
    document.getElementById("your-aus").innerHTML = "Your picture: " + auData.actionUnits;
    document.getElementById("your-aus").style.display = "block";
    document.getElementById("jaccard-score").innerHTML = "Jaccard Score: " + Math.round(auData.jaccardIndex * 100) + "%";
    document.getElementById("jaccard-score").style.display = "block";
  }
  else {
    document.getElementById("error-msg").innerHTML = auData.errorMessage;
    document.getElementById("error-msg").style.display = "block";
  }

}

function startNewGame() {
  if (isRunning === false) {
    document.getElementById("timer").innerHTML = "Loading new image...";
    getImageThenStart();
  }
}

function countdown(seconds) {
  const timerElem = document.getElementById("timer");
  function tick() {
    if (seconds === 0) {
      timerElem.innerHTML = "Evaluating Action Units...";
      isRunning = false;
      finishRound();
    } else {
      timerElem.innerHTML = seconds;
      seconds -= 1;
      setTimeout(tick, 1000);
    }
  }
  setTimeout(tick, 1000)
}



function setNewImage(imagePath) {
  const img = new Image();
  img.src = imagePath;
  img.onload = () => {
    ctxCanvasImage.drawImage(img, 0, 0, canvasImage.width, canvasImage.height);
  }
}

async function retryGame() {
  await getNewGameplayId(currentGameplayData.imageId);
  startRound();
}

async function getGameplayData() {
  const apiURL = `/api/getGameplayData?sessionId=${currentSessionId}`
  let res = await fetch(apiURL, { method: "GET" });
  let json = await res.json();
  return json;
}

async function requestActionUnits(image, gameplayId, sessionId, goldId, isPreheat) {
  const apiURL = "/api/getActionUnits";
  const data = { "base64image": image, "gameplayId": gameplayId, "sessionId": sessionId, "goldId": goldId, "isPreheat": isPreheat };
  let res = await fetch(apiURL, {
    method: "POST", mode: 'cors',
    headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
  });
  let json = await res.json();
  return json;
}

async function sendStatusVector(statusVector, gameplayId, sessionId, isPreheat) {
  const apiURL = "/api/uploadOnlineResults";
  const data = { "statusVector": statusVector, "gameplayId": gameplayId, "sessionId": sessionId, "isPreheat": isPreheat };
  let res = await fetch(apiURL, {
    method: "POST", mode: 'cors',
    headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
  });
  return;
}

async function getSessionId() {
  const apiURL = "/api/getSessionId";
  let res = await fetch(apiURL, { method: "GET" });
  await res.json().then(json => {
    console.log("Session ID: ", json.sessionId);
    currentSessionId = json.sessionId;
  });
  return currentSessionId;
}

async function getNewGameplayId(imageId) {
  const apiURL = `/api/getNewGameplayId?imageId=${imageId}`;
  let res = await fetch(apiURL, { method: "GET" });
  await res.json().then(json => {
    // console.log("Gameplay ID: ", json.gameplayId)
    currentGameplayData.gameplayId = json.gameplayId;
  });
}

function getFalseAUs(correctAUs, playerAUs) {
  const falseAUs = [];
  correctAUs.forEach(au => {
    if (!(playerAUs.includes(au))) {
      falseAUs.push(au);
    }
  })
  playerAUs.forEach(au => {
    if (!(correctAUs.includes(au))) {
      falseAUs.push(au);
    }
  })
  return falseAUs;
}


/**
 * startWebcam - Function that starts the webcam and displays it in the "video" object.
 *
 */
async function startWebcamChooser() {
  const cameraSelectBox = document.getElementById("camera-select-box");

  cameraSelectBox.addEventListener('click', event => {
    if (typeof currentStream !== 'undefined') {
      stopMediaTracks(currentStream);
    }
    const videoConstraints = {
      "frameRate": 25
    };
    if (cameraSelectBox.value === '') {
      videoConstraints.facingMode = 'user';
    } else {
      videoConstraints.deviceId = {
        exact: cameraSelectBox.value
      };
    }
    const constraints = {
      video: videoConstraints,
      audio: false
    };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(stream => {
        console.log("Stream:", stream.active);
        currentStream = stream;
        video.srcObject = stream;
        const videoProps = stream.getTracks()[0].getSettings();
        videoWidth = videoProps.width;
        videoHeight = videoProps.height;
        showVideoOnCanvas();
        return navigator.mediaDevices.enumerateDevices();
      })
      .then(gotDevices)
      .catch(error => {
        console.error(error);
      });

  });

  cameraSelectBox.click(); // to start webcam automatically

  function gotDevices(mediaDevices) {
    const cameraSelectBox = document.getElementById("camera-select-box");
    cameraSelectBox.innerHTML = "";
    let count = 1;
    mediaDevices.forEach(mediaDevice => {
      if (mediaDevice.kind === 'videoinput') {
        const option = document.createElement('option');
        option.value = mediaDevice.deviceId;
        if (count === 1) {
          option.selected = true;
        }
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


