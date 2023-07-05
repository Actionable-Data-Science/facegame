const cameraSelect = document.getElementById("cameraSelect");
const videoCanvas = document.getElementById("canvasPlayer");
const videoHTML = document.getElementById("videoInput");
const retryButton = document.getElementById("retryButton");
const nextButton = document.getElementById("nextButton");
const visualizationCanvas = document.getElementById("canvasTransparent");
const targetImageCanvas = document.getElementById("canvasTargetImage");

class TargetImageLoader {
  constructor() {
    this.currentImageData = null;
    this.currentImageUrl = null;
    this.currentActionUnits = null;
    this.currentImageId = null;
    this.currentSuccess = false;

    this.nextImageData = null;
    this.nextImageUrl = null;
    this.nextActionUnits = null;
    this.nextImageId = null;
    this.nextSuccess = false;
  }

  async loadRandomTargetImage() {
    this.currentImageData = this.nextImageData;
    this.currentImageUrl = this.nextImageUrl;
    this.currentActionUnits = JSON.parse(this.nextActionUnits);
    this.currentImageId = this.nextImageId;
    this.currentSuccess = this.nextSuccess;

    this.nextImageData = null;
    this.nextImageUrl = null;
    this.nextActionUnits = null;
    this.nextImageId = null;
    this.nextSuccess = false;

    const response = await fetch("/api/get_random_target_image");
    const data = await response.json();

    if (data.success === false) {
      return; // Error occurred
    }

    this.nextSuccess = data.success;
    this.nextActionUnits = data.action_units;
    this.nextImageId = data.image;

    const imageResponse = await fetch(
      `/api/get_target_image/${this.nextImageId}`
    );
    const blob = await imageResponse.blob();
    this.nextImageData = URL.createObjectURL(blob);
  }

  getCurrentImageData() {
    return this.currentImageData;
  }

  getCurrentActionUnits() {
    return this.currentActionUnits;
  }

  getCurrentImageId() {
    return this.currentImageId;
  }

  getCurrentSuccess() {
    return this.currentSuccess;
  }
}

class Game {
  _cam;
  _retryButton;
  _nextButton;
  _visualizationCanvas;
  _targetImageCanvas;
  _targetImageLoader;
  _targetImageCanvasContext;
  _currentTargetActionUnits;

  constructor(
    retryButton,
    nextButton,
    visualizationCanvas,
    cameraSelect,
    videoCanvas,
    videoHTML,
    targetImageCanvas
  ) {
    this._cam = new Cam(cameraSelect, videoCanvas, videoHTML);
    this._cam.detectCameras();
    this._retryButton = retryButton;
    this._nextButton = nextButton;
    this._visualizationCanvas = visualizationCanvas;

    this._targetImageCanvas = targetImageCanvas;
    this._targetImageCanvasContext = targetImageCanvas.getContext("2d");
    this._targetImageLoader = new TargetImageLoader();
    this._targetImageLoader.loadRandomTargetImage().then(() => {
      this._targetImageLoader.loadRandomTargetImage().then(() => {
        this.initializeButtonListeners();
      });
    });
  }

  initializeButtonListeners() {
    this._retryButton.addEventListener("click", () => this.retry());
    this._nextButton.addEventListener("click", () => this.next());
  }

  async startNextRound() {
    this._currentTargetActionUnits =
      this._targetImageLoader.getCurrentActionUnits();
    const currentImg = new Image();
    currentImg.src = this._targetImageLoader.getCurrentImageData();
    currentImg.onload = () => {
      this._targetImageCanvasContext.drawImage(currentImg, 0, 0, 480, 360);
    };
    this._cam.resumeVideo();
    const context = this._visualizationCanvas.getContext("2d");
    context.clearRect(
      0,
      0,
      this._visualizationCanvas.width,
      this._visualizationCanvas.height
    );
  }

  retry() {
    this.startNextRound();
    this.startCountdown(3);
    setTimeout(() => this.endRound(), 3000);
  }

  next() {
    this._targetImageLoader.loadRandomTargetImage();
    this.startNextRound();
    this.startCountdown(3);
    setTimeout(() => this.endRound(), 3000);
  }

  endRound() {
    const videoCanvas = document.getElementById("canvasPlayer");
    const dataCollector = new DataCollector();
    // Add the "flash-animation" class to the video canvas
    videoCanvas.classList.add("flash-animation");

    const image = this._cam.takeSnapshot();
    dataCollector.setTargetImageId(this._targetImageLoader.getCurrentImageId());
    image.onload = async () => {
      const ouface = new OUFace(image, dataCollector);
      const results = await ouface.withActionUnits().startDetection();
      this.showResults(await results);
    };

    // Remove the "flash-animation" class after a short delay (e.g., 250ms)
    setTimeout(() => {
      videoCanvas.style.opacity = "0.5"; // Adjust the desired opacity value
    }, 250);

    // Gradually fade back to normal opacity over time (e.g., 500ms)
    const animationDuration = 500; // Adjust the desired animation duration
    const fadeInterval = 10; // Adjust the interval for opacity changes
    let currentOpacity = 0.5; // Adjust the initial opacity value

    const fadeIntervalId = setInterval(() => {
      currentOpacity +=
        (1 - currentOpacity) / (animationDuration / fadeInterval);
      videoCanvas.style.opacity = currentOpacity.toString();

      if (currentOpacity >= 0.99) {
        clearInterval(fadeIntervalId);
        videoCanvas.classList.remove("flash-animation");
      }
    }, fadeInterval);
  }

  showResults(results) {
    try {
      // console.log(results)
      const fv = new FaceVisualizer(480, 360, results.landmarks._positions)
        .visualizeActionUnitDifference(
          results.actionUnits,
          this._currentTargetActionUnits
        )
        .visualizeJaccardIndex(
          results.actionUnits,
          this._currentTargetActionUnits
        )
        .visualizeDetectedAUs(results.actionUnits)
        .visualizeTargetAUs(this._currentTargetActionUnits)
        .analyzeImageAnimation(this._visualizationCanvas);
    } catch (e) {
      console.log(e);
      showFlashMessage();
    }
  }

  startCountdown(seconds) {
    // Calculate the countdown end time
    var countdownEndTime = new Date().getTime() + seconds * 1000;

    // Get the canvas element
    var ctx = this._visualizationCanvas.getContext("2d");

    // Update the countdown every second
    var countdownInterval = setInterval(() => {
      // Get the current date and time
      var now = new Date().getTime();

      // Find the distance between now and the countdown end time
      var distance = countdownEndTime - now;

      // Calculate time units
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // If the countdown is finished, display a message
      if (distance < 0) {
        clearInterval(countdownInterval);
        ctx.clearRect(
          0,
          0,
          this._visualizationCanvas.width,
          this._visualizationCanvas.height
        );
      } else if (distance < 300) {
        ctx.clearRect(
          0,
          0,
          this._visualizationCanvas.width,
          this._visualizationCanvas.height
        );
      } else {
        ctx.clearRect(
          0,
          0,
          this._visualizationCanvas.width,
          this._visualizationCanvas.height
        );
        ctx.font = "60px Arial";
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = "center";
        ctx.fillText(
          seconds + 1,
          this._visualizationCanvas.width / 2,
          this._visualizationCanvas.height / 3
        );
      }
    }, 100);
  }
}

modelsLoaded.then((models) => {
  const game = new Game(
    retryButton,
    nextButton,
    visualizationCanvas,
    cameraSelect,
    videoCanvas,
    videoHTML,
    targetImageCanvas
  );
});

function showFlashMessage(message) {
  const flashMessageContainer = document.getElementById(
    "flashMessageContainer"
  );
  flashMessageContainer.innerHTML = message;
  flashMessageContainer.style.display = "block";

  setTimeout(() => {
    flashMessageContainer.style.display = "none";
  }, 5000);
}
