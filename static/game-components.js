const canvasSnapshot = document.getElementById("canvas-snapshot");
const ctxCanvasSnapshot = canvasSnapshot.getContext("2d");
const canvasHeatmap = document.getElementById("canvas-heatmap");
const ctxCanvasHeatmap = canvasHeatmap.getContext("2d");
const video = document.getElementById("video-input");

let currentStream;
let videoWidth;
let videoHeight;

function showVideoOnCanvas() {
    var canvasVideo = document.getElementById("canvas-video");
    var ctxCanvasVideo = canvasVideo.getContext("2d");

    // console.log(`CAM: w: ${videoWidth}, h: ${videoHeight}`);

    const ratio = videoWidth / videoHeight;
    const targetWidth = videoWidth / ratio;
    const targetHeight = videoHeight / ratio;
    const y = (canvasVideo.height - targetHeight) / 2;
    const x = (canvasVideo.width - targetWidth) / 2;

    // console.log(`TARGET: w: ${targetWidth}, h: ${targetHeight}`);
    // console.log(`CAM: x-Offset: ${x}, y-Offset: ${y}, ratio: ${ratio}`);

    video.addEventListener("play", update());
    ctxCanvasVideo.scale(-1, 1);
    function update() {
        ctxCanvasVideo.translate(ctxCanvasVideo.width, 0);

        ctxCanvasVideo.drawImage(video, x * -1, y, targetWidth * -1, targetHeight);
        requestAnimationFrame(update);
    }
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


