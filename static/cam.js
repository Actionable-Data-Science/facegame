const cameraMenu = document.getElementById("camera-select-box");
const video = document.getElementById("video-input");
const canvasVideo = document.getElementById("canvas-video");
const ctxCanvasVideo = canvasVideo.getContext("2d");

ctxCanvasVideo.scale(-1, 1);

// let currentStream;
// let videoWidth;
// let videoHeight;
let streamRunning = false;

console.log("HI FROM CAM");

const detectCameras = async () => { // detecting all camera devices and putting them into the select (drop down menu)
    console.log("Detecting cameras");
    const allDevices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = allDevices.filter(device => device.kind === 'videoinput');
    const options = videoDevices.map(videoDevice => {
        return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`;
    });
    cameraMenu.innerHTML = options.join('');

};

const startStream = async (constraints) => {
    console.log("Starting stream");
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleStream(stream);
};

const handleStream = (stream) => {
    console.log("Handling stream");
    video.srcObject = stream;
    const videoProps = stream.getTracks()[0].getSettings();
    videoWidth = videoProps.width;
    videoHeight = videoProps.height;
    // play.classList.add('d-none');
    // pause.classList.remove('d-none');
    // screenshot.classList.remove('d-none');
    streamRunning = true;
    showVideoOnCanvas(videoWidth, videoHeight);
};

// async function enumerateMediaDevices() {
//     const devices = await navigator.mediaDevices.enumerateDevices();
// }


cameraMenu.addEventListener("change", event => {
    if (typeof video.srcObject !== 'undefined') {
        stopMediaTracks(video.srcObject);
    }
    console.log(`Cam changed to ${cameraMenu.value}`);
    if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
        const newConstraints = {
            video: {
                deviceId: {
                    exact: cameraMenu.value // the camera currently selected in drop down menu
                }
            }
        };
        startStream(newConstraints);
    } else {
        console.log("Error here");
    }
})

function stopMediaTracks() {
    video.srcObject.getTracks().forEach(track => {
        track.stop();
    });
}

function showVideoOnCanvas(videoWidth, videoHeight) {
    console.log("Start showing video on canvas");
    console.log(`CAM: w: ${videoWidth}, h: ${videoHeight}`);

    const ratio = videoWidth / videoHeight;
    const targetWidth = videoWidth / ratio;
    const targetHeight = videoHeight / ratio;
    const y = (canvasVideo.height - targetHeight) / 2;
    const x = (canvasVideo.width - targetWidth) / 2;

    console.log(`TARGET: w: ${targetWidth}, h: ${targetHeight}`);
    console.log(`CAM: x-Offset: ${x}, y-Offset: ${y}, ratio: ${ratio}`);

    video.addEventListener("play", update);
    
    function update() {
        ctxCanvasVideo.translate(ctxCanvasVideo.width, 0);

        ctxCanvasVideo.drawImage(video, x * -1, y, targetWidth * -1, targetHeight);
        requestAnimationFrame(update);
    }
}

if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) { // check if API is available
    console.log("getUserMedia available");
    const constraints = { video: { facingMode: 'user' } };
    navigator.mediaDevices.getUserMedia({ video: true });
    startStream(constraints);
    
} else {
    console.log("Webcam: Fatal Error");
}



