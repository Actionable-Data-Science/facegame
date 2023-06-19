const cameraSelect = document.getElementById("cameraSelect");
const videoCanvas = document.getElementById("canvasPlayer");
const videoHTML = document.getElementById("videoInput");
const retryButton = document.getElementById("retryButton");
const nextButton = document.getElementById("nextButton");
const visualizationCanvas = document.getElementById("canvasTransparent");

const actionUnitsSwitch = document.getElementById("actionUnitsSwitch");
const landmarksSwitch = document.getElementById("landmarksSwitch");
const boundingBoxSwitch = document.getElementById("boundingBoxSwitch");
const ageSwitch = document.getElementById("ageSwitch");
const genderSwitch = document.getElementById("genderSwitch");
const emotionSwitch = document.getElementById("emotionSwitch");

class Mirror {
  _cam;
  _visualizationCanvas;
  _framerate;
  _results;
  _actionUnitsSwitch;
  _landmarksSwitch;
  _boundingBoxSwitch;
  _ageSwitch;
  _genderSwitch;
  _emotionSwitch;
  _actionUnitsValue;
  _landmarksValue;
  _boundingBoxValue;
  _ageValue;
  _genderValue;
  _emotionValue;
  _restarted;
  _fps;
  _startTimestamp;

  constructor(
    visualizationCanvas,
    cameraSelect,
    videoCanvas,
    videoHTML,
    framerate,
    actionUnitsSwitch,
    landmarksSwitch,
    boundingBoxSwitch,
    ageSwitch,
    genderSwitch,
    emotionSwitch
  ) {
    this._cam = new Cam(cameraSelect, videoCanvas, videoHTML);
    this._cam.detectCameras();
    this._visualizationCanvas = visualizationCanvas;
    this._framerate = framerate;
    this._actionUnitsSwitch = actionUnitsSwitch;
    this._landmarksSwitch = landmarksSwitch;
    this._boundingBoxSwitch = boundingBoxSwitch;
    this._ageSwitch = ageSwitch;
    this._genderSwitch = genderSwitch;
    this._emotionSwitch = emotionSwitch;
    this.addSwitchEventListeners();
    this._restarted = false;
  }

  addSwitchEventListeners() {
    this._actionUnitsSwitch.addEventListener("change", () => {
      this._actionUnitsValue = this._actionUnitsSwitch.checked;
      this._restarted = true;
      // console.log("Action Units:", this._actionUnitsValue);
    });

    this._landmarksSwitch.addEventListener("change", () => {
      this._landmarksValue = this._landmarksSwitch.checked;
      this._restarted = true;
      // console.log("Landmarks:", this._landmarksValue);
    });

    this._boundingBoxSwitch.addEventListener("change", () => {
      this._boundingBoxValue = this._boundingBoxSwitch.checked;
      this._restarted = true;
      // console.log("Bounding Box:", this._boundingBoxValue);
    });

    this._ageSwitch.addEventListener("change", () => {
      this._ageValue = this._ageSwitch.checked;
      this._restarted = true;
      // console.log("Age:", this._ageValue);
    });

    genderSwitch.addEventListener("change", () => {
      this._genderValue = this._genderSwitch.checked;
      this._restarted = true;
      // console.log("Gender:", this._genderValue);
    });

    emotionSwitch.addEventListener("change", () => {
      this._emotionValue = this._emotionSwitch.checked;
      this._restarted = true;
      // console.log("Emotion:", this._emotionValue);
    });
  }

  startNextRound() {
    this._startTimestamp = performance.now();
    if (this._restarted === true) {
      this._restarted = false;
      this.startNextRound();
    } else {
      this._cam.resumeVideo();
      //this.updateVisualization();
      this.endRound();
    }
  }

  endRound() {
    const image = this._cam.takeSnapshot();
    this._cam.resumeVideo();

    const ouface = new OUFace(image);
    ouface
      .withActionUnits()
      .startDetection()
      .then((results) => {
        this._results = results;
        console.log(results);
        this.updateVisualization();
      });
  }

  updateVisualization() {
    if (this._results != undefined) {
      console.log(this._results);
      const context = this._visualizationCanvas.getContext("2d");
      context.clearRect(
        0,
        0,
        this._visualizationCanvas.width,
        this._visualizationCanvas.height
      );
      var fv = new FaceVisualizer(480, 360, this._results.landmarks._positions);
      fv =
        this._actionUnitsValue === true
          ? fv.visualizeActionUnits(this._results.actionUnits)
          : fv;
      if (this._landmarksValue === true) {
        console.log("AUS");
        fv = fv.visualizeFaceLandmarks();
      }
      if (this._boundingBoxValue === true) {
        console.log("BBOX");
        fv = fv.visualizeFaceBoundingBox(this._results.alignedRect._box);
      }
      if (this._ageValue === true) {
        console.log("AGE");
        fv = fv.visualizeAge(Math.round(this._results.age));
      }
      if (this._genderValue === true) {
        console.log("GENDER");
        fv = fv.visualizeGender(this._results.gender);
      }
      if (this._emotionValue === true) {
        console.log("EMOTION");
        fv = fv.visualizeEmotion(this._results.expressions);
      }
      fv.drawOnCanvas(this._visualizationCanvas);
    }
    const endTimestamp = performance.now(); // Record the end time
    const elapsedSeconds = (endTimestamp - this._startTimestamp) / 1000; // Calculate the elapsed time in seconds
    this._fps = 1 / elapsedSeconds; // Calculate the FPS
    console.log("FPS: ", this._fps);
    requestAnimationFrame(() => this.startNextRound());
  }
}

modelsLoaded.then((models) => {
  const game = new Mirror(
    visualizationCanvas,
    cameraSelect,
    videoCanvas,
    videoHTML,
    1,
    actionUnitsSwitch,
    landmarksSwitch,
    boundingBoxSwitch,
    ageSwitch,
    genderSwitch,
    emotionSwitch
  );

  game.startNextRound();
});
