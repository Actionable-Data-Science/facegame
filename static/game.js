//jshint esversion:6

const canvasImage = document.getElementById("canvas-image");
const ctxCanvasImage = canvasImage.getContext("2d");
const timerElem = document.getElementById("timer");

let currentGameplayData;
let currentSessionId;
let currentStatus;

const displaySize = {
    width: canvasSnapshot.width,
    height: canvasSnapshot.height
};

document.getElementById("new-game-btn").addEventListener("click", startNewGame);
document.getElementById("retry-btn").addEventListener("click", retryGame);

let isRunning = false;

prepare();

async function main() {
    getImageThenStart();
}

async function getImageThenStart() {
    currentGameplayData = await getGameplayData();
    startRound();
}

function changeViewToActiveGame() {
    document.getElementById("error-msg").innerHTML = "";
    document.getElementById('canvas-heatmap').style.display = "none";
    document.getElementById('new-game-btn').disabled = true;
    document.getElementById('retry-btn').disabled = true;
    document.getElementById("timer").innerHTML = "";
    document.getElementById("timer").style.display = "block";
    document.getElementById("jaccard-score").innerHTML = "";
    document.getElementById("canvas-snapshot").style.display = "none";
    document.getElementById("prescription-table").innerHTML = "";
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
    const t0 = performance.now();
    const actionUnitData = requestActionUnits(snapshot, currentGameplayData.gameplayId, currentSessionId, currentGameplayData.imageId, false, true);
    const detections = await faceapi.detectSingleFace(canvasSnapshot).withFaceLandmarks();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    const landmarks = resizedDetections.landmarks._positions;
    actionUnitData.then(auData => {
        booked = [];
        showScores(auData);
        showHeatmap(currentGameplayData.actionUnits, auData.actionUnits, canvasSnapshot);
        drawAUs(canvasSnapshot, currentGameplayData.actionUnits, auData.actionUnits, landmarks, false);
        const t1 = performance.now();
        const timeToComplete = t1 - t0;
        console.log("Time between image sent and AUs received: ", timeToComplete, "ms");
    });
    generateStatus(snapshot, currentGameplayData.gameplayId, currentSessionId, false);
}

function showScores(auData) {
    document.getElementById("timer").style.display = "none";
    if (auData.success) {
        document.getElementById("jaccard-score").innerHTML = "Score: " + Math.round(auData.jaccardIndex * 100) + "%";
        document.getElementById("jaccard-score").style.display = "block";
        document.getElementById("prescription-table").innerHTML = generatePrescriptionTable(auData.actionUnits, currentGameplayData.actionUnits);
    } else {
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
    let res = await fetch(apiURL, {
        method: "GET"
    });
    let json = await res.json();
    return json;
}

async function sendStatusVector(statusVector, gameplayId, sessionId, isPreheat) {
    const apiURL = "/api/uploadOnlineResults";
    const data = {
        "statusVector": statusVector,
        "gameplayId": gameplayId,
        "sessionId": sessionId,
        "isPreheat": isPreheat
    };
    let res = await fetch(apiURL, {
        method: "POST",
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return;
}

async function getNewGameplayId(imageId) {
    const apiURL = `/api/getNewGameplayId?imageId=${imageId}`;
    let res = await fetch(apiURL, {
        method: "GET"
    });
    await res.json().then(json => {
        currentGameplayData.gameplayId = json.gameplayId;
    });
}