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

const auLandmarkMap = {
  "1": [20, 21, 22, 23],
  "2": [17, 18, 19, 24, 25, 26],
  "4": [17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
  "5": [37, 38, 43, 44],
  "7": [37, 38, 40, 41, 43, 44, 46, 47],
  "9": [27, 31, 32, 34, 35],
  "10": [49, 50, 51, 52, 53, 61, 63],
  "11": [31, 35],
  "12": [48, 49, 53, 54, 60, 64],
  "15": [48, 49, 53, 54, 60, 64],
  "16": [55, 56, 57, 58, 59, 65, 66, 67],
  "17": [7, 8, 9],
  "18": [48, 54, 61, 62, 63, 65, 66, 67],
  "20": [48, 49, 53, 54],
  "22": [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67],
  "23": [48, 49, 53, 54, 55, 59, 60, 64],
  "24": [61, 62, 63, 65, 66, 67],
  "25": [61, 62, 63, 65, 66, 67],
  "26": [7, 8, 9],
  "27": [48, 49, 50, 52, 53, 54, 55, 56, 57, 58, 59],
  "28": [49, 50, 51, 52, 53, 55, 56, 57, 58, 59, 61, 62, 63, 65, 66, 67],
  "41": [36, 37, 38, 39, 42, 43, 44, 45],
  "42": [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47],
  "43": [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47],
  "44": [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47],
  "45": [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47],
  "46": [42, 43, 44, 45, 46, 47]
}

document.getElementById("new-game-btn").addEventListener("click", startNewGame);
document.getElementById("retry-btn").addEventListener("click", retryGame);

let heat = simpleheat(document.getElementById("canvas-heatmap"));
const heatval = 0.8
heat.radius(8, 4); // setting point and blur radius (3, 2)

let isRunning = false;

main() // .then(setTimeout(preheatAUDetection, 1000));

async function preheatWebmodels() {
  ctxCanvasSnapshot.drawImage(canvasVideo, 0, 0, canvasVideo.width, canvasVideo.height);
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
  // ctxCanvasVideo.scale(-1, 1);

  console.log(`CAM: w: ${videoWidth}, h: ${videoHeight}`);

  const ratio = videoWidth / videoHeight;
  const targetWidth = videoWidth / ratio;
  const targetHeight = videoHeight / ratio;
  const y = (canvasVideo.height - targetHeight) / 2;
  const x = (canvasVideo.width - targetWidth) / 2;

  console.log(`TARGET: w: ${targetWidth}, h: ${targetHeight}`);
  console.log(`CAM: x-Offset: ${x}, y-Offset: ${y}, ratio: ${ratio}`);

  video.addEventListener("play", update());

  function update(){
    ctxCanvasVideo.drawImage(video, x, y, targetWidth, targetHeight);
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
  document.getElementById('canvas-heatmap').style.display = "none"
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
  document.getElementById("correct-aus").innerHTML = "Our picture: " + currentGameplayData.actionUnits;
  document.getElementById("correct-aus").style.display = "block";
  document.getElementById("timer").style.display = "none";
  document.getElementById("your-aus").innerHTML = "Your picture: " + auData.actionUnits;
  document.getElementById("your-aus").style.display = "block";
  document.getElementById("jaccard-score").innerHTML = "Jaccard Score: " + Math.round(auData.jaccardIndex * 100) + "%";
  document.getElementById("jaccard-score").style.display = "block";
  document.getElementById("retry-btn").style.display = "inline-block";
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

function changeCanvasAlpha(canvas, alpha) {
  let ctx = canvas.getContext("2d");
  let image = ctx.getImageData(0, 0, 480, 360);
  var imageData = image.data;
  let length = imageData.length;
  for (var i = 3; i < length; i += 4) {
    imageData[i] = alpha;
  }
  image.data = imageData;
  ctx.putImageData(image, 0, 0);
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

async function showHeatmap(correctAUs, playerAUs, image) {
  const falseAUs = getFalseAUs(correctAUs, playerAUs);
  detection = await faceapi.detectSingleFace(image).withFaceLandmarks();
  const data = generateHeatmapData(falseAUs, detection.landmarks._positions);
  heat.data(data)
  heat.draw(0.01);
  changeCanvasAlpha(canvasHeatmap, 43);
}

function generateHeatmapData(falseAUs, landmarks) {
  heatData = [];
  landmarkHeat = {};
  falseAUs.forEach(au => {
    if (Object.keys(auLandmarkMap).includes(au.toString())) {
      auLandmarkMap[au].forEach(lm => {
        if (Object.keys(landmarkHeat).includes(lm)) {
          landmarkHeat[lm] += heatval / 3;
        } else {
          landmarkHeat[lm] = heatval;
        }
      })
    } else {
      if (au == 6) {
        const cheekPufferLands = getCheekPufferLands(landmarks);
        let cheekPufferCounter = 0;
        cheekPufferLands.forEach(lm => {
          cheekPufferCounter++;
          landmarkHeat[`cheekPuffer${cheekPufferCounter}`] = lm;
        })
      } else if (au == 13) {
        const cheekRaiserLands = getCheekRaiserLands(landmarks);
        let cheekRaiserCounter = 0;
        cheekRaiserLands.forEach(lm => {
          cheekRaiserCounter++;
          landmarkHeat[`cheekRaiser${cheekRaiserCounter}`] = lm;
        })
      } else if (au == 14) {
        const dimplerLands = getDimplerLands(landmarks);
        let dimplerCounter = 0;
        dimplerLands.forEach(lm => {
          dimplerCounter++;
          landmarkHeat[`dimpler${dimplerCounter}`] = lm;
        })
      } else {
        console.log(`AU unknown, skipping ${au}`);
      }
    }
  })
  Object.keys(landmarkHeat).forEach(lm => {
    if (!(lm.startsWith("c") || (lm.startsWith("d")))) {
      heatData.push([landmarks[lm]._x, landmarks[lm]._y, landmarkHeat[lm]]);
    } else {
      heatData.push([landmarkHeat[lm]._x, landmarkHeat[lm]._y, heatval])
    }

  })
  return heatData;
}

function getCheekPufferLands(landmarks) {
  const cheekLeft1 = getMiddle(getLandmarksByNr(landmarks, [4, 2, 29, 29, 29, 29, 29, 29]));
  const cheekLeft2 = getMiddle(getLandmarksByNr(landmarks, [4, 2, 29, 29, 29, 29]));
  const cheekLeft3 = getMiddle(getLandmarksByNr(landmarks, [4, 2, 29, 29]));
  const cheekRight1 = getMiddle(getLandmarksByNr(landmarks, [12, 14, 29, 29, 29, 29, 29, 29]));
  const cheekRight2 = getMiddle(getLandmarksByNr(landmarks, [12, 14, 29, 29, 29, 29]));
  const cheekRight3 = getMiddle(getLandmarksByNr(landmarks, [12, 14, 29, 29]));
  const cheekPufferLands = [cheekLeft1, cheekLeft2, cheekLeft3, cheekRight1, cheekRight2, cheekRight3];
  return cheekPufferLands;
}

function getCheekRaiserLands(landmarks) {
  const cheekLeft1 = getMiddle(getLandmarksByNr(landmarks, [35, 42, 42, 42]));
  const cheekLeft2 = getMiddle(getLandmarksByNr(landmarks, [35, 45, 45, 45]));
  const cheekLeft3 = getMiddle(getLandmarksByNr(landmarks, [35, 46, 46, 46]));
  const cheekLeft4 = getMiddle(getLandmarksByNr(landmarks, [35, 47, 47, 47]));
  const cheekRight1 = getMiddle(getLandmarksByNr(landmarks, [31, 36, 36, 36]));
  const cheekRight2 = getMiddle(getLandmarksByNr(landmarks, [31, 39, 39, 39]));
  const cheekRight3 = getMiddle(getLandmarksByNr(landmarks, [31, 40, 40, 40]));
  const cheekRight4 = getMiddle(getLandmarksByNr(landmarks, [31, 41, 41, 41]));
  const cheekRaiserLands = [cheekLeft1, cheekLeft2, cheekLeft3, cheekLeft4, cheekRight1, cheekRight2, cheekRight3, cheekRight4];
  return cheekRaiserLands;
}

function getDimplerLands(landmarks) {
  const dimplerLeft1 = getMiddle(getLandmarksByNr(landmarks, [11, 12, 54, 54, 54, 54]));
  const dimplerRight1 = getMiddle(getLandmarksByNr(landmarks, [3, 4, 48, 48, 48, 48]));
  const dimplerLands = [dimplerLeft1, dimplerRight1];
  return dimplerLands;
}

function getDistance(pointA, pointB) {
  return Math.sqrt(Math.pow((pointB[0] - pointA[0]), 2) + Math.pow((pointB[1] - pointA[1]), 2));
}

function getLandmarksByNr(landmarks, listOfLandmarkNumbers) {
  landmarksList = [];
  listOfLandmarkNumbers.forEach(nr => {
    landmarksList.push(landmarks[nr]);
  })
  // console.log("Landmarks-List: ", landmarksList);
  return landmarksList;
}

function getMiddle(listOfPoints) {
  let xSum = 0;
  let ySum = 0;
  nrPoints = listOfPoints.length;
  listOfPoints.forEach(point => {
    xSum += point._x;
    ySum += point._y;
  })
  return { "_x": xSum / nrPoints, "_y": ySum / nrPoints };
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
        if (count === 1){
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


