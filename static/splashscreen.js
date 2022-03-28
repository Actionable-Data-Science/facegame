const cameraButton = document.getElementById("allow-camera-btn");
const errorMessageElem = document.getElementById("error-msg");
const startButton = document.getElementById("start-btn");

var successCallback = function(error) {
    cameraButton.disabled = true;
    cameraButton.innerText = "Camera access granted"
    startButton.style.display = "block";
    detectCameras();
};

var errorCallback = function(error) {
    if (error.name == 'NotAllowedError') {
        errorMessageElem.innerHTML = "Camera permission was not given. Please reload the page and allow camera access."
    } else {
        errorMessageElem.innerHTML = error;
    }
    errorMessageElem.innerHTML += " If you believe that this is an error on our side, please let us know."
    cameraButton.style.display = "none";
};

cameraButton.addEventListener("click", function() {
    console.log("Asking for camera access.");
    getCameraConsent();
});

startButton.addEventListener("click", function() {
    document.getElementById("splashscreen-content").style.display = "none";
    document.getElementById("game-content").style.display = "block";
});

async function prepare(){
    getSessionId().then(sessionId => loadModels());
}

async function getCameraConsent() {
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
    }).then(successCallback, errorCallback);
}