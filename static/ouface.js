let auModel;

const modelsLoaded = loadModels();

async function loadModels() {
  await faceapi.nets.faceLandmark68Net.loadFromUri("/static/models/");
  await faceapi.nets.ssdMobilenetv1.loadFromUri("/static/models/");
  await faceapi.nets.faceExpressionNet.loadFromUri("/static/models/");
  await faceapi.nets.faceRecognitionNet.loadFromUri("/static/models/");
  await faceapi.nets.ageGenderNet.loadFromUri("/static/models/");
  auModel = await faceapi.tf.loadLayersModel("/static/models/Krist/model.json");
  return;
}

class OUFace {
  _landmarks = false;
  _expressions = false;
  _actionUnits = false;
  _age = false;
  _gender = false;
  _allFaces = false;
  _faceDescriptor = false;
  _faceapiResult;
  _dataCollector;

  constructor(img, dataCollector) {
    this.image = img;
    this._dataCollector = dataCollector;
  }

  allFaces() {
    this._allFaces = true;
    return this;
  }

  withLandmarks() {
    this._landmarks = true;
    return this;
  }

  withExpressions() {
    this.withLandmarks();
    this._expressions = true;
    return this;
  }

  withActionUnits() {
    this._actionUnits = true;
    return this;
  }

  withAge() {
    this.withLandmarks();
    this._age = true;
    return this;
  }

  withGender() {
    this._gender = true;
    return this;
  }

  withFaceDescriptor() {
    this.withExpressions();
    this._faceDescriptor = true;
    return this;
  }

  startDetection = async () => {
    if (!this._allFaces) {
      if (!this._actionUnits) {
        console.time("FaceAPI");
        const results = await faceapi
          .detectSingleFace(this.image)
          .withFaceLandmarks()
          .withFaceExpressions()
          .withAgeAndGender()
          .withFaceDescriptor();
        console.timeEnd("FaceAPI");
        return results;
      } else {
        console.time("FaceAPI");
        const results = await faceapi
          .detectSingleFace(this.image)
          .withFaceLandmarks()
          .withFaceExpressions()
          .withAgeAndGender()
          .withFaceDescriptor();
        if (results === undefined) {
          // throw new Error("Face not detected")
        } else {
          const resizedResults = faceapi.resizeResults(
            results,
            this.getDisplaySize()
          );
          console.timeEnd("FaceAPI");
          console.time("ActionUnits");
          const maskedFace = await this.getMaskedFaceImage(resizedResults);
          const actionUnits = await this.predictAUs(maskedFace);
          console.timeEnd("ActionUnits");
          resizedResults.maskedFace = maskedFace;
          resizedResults.actionUnits = actionUnits;
          //   console.log(resizedResults.landmarks)
          //   await this.waitForLandmarks(resizedResults);

          if (this._dataCollector != undefined) {
            console.log("DC");
            console.log("SHARING ENABLED");
            this._dataCollector.setImage(this.image);
            this._dataCollector.setImageCroppedMasked(maskedFace);
            this._dataCollector.setActionUnits(actionUnits);
            console.log("ALL SET");
            this._dataCollector.uploadCollectedData().then(() => {
              console.log("UPLOADED");
            });
          }
          return resizedResults;
        }
      }
    } else {
      console.log("All faces not supported yet");
      return;
    }
  };

  waitForLandmarks(resizedResults) {
    return new Promise((resolve) => {
      const checkLandmarks = async () => {
        if (resizedResults.landmarks) {
          resolve();
        } else {
          setTimeout(checkLandmarks, 100); // Wait for 100 milliseconds before checking again
        }
      };

      checkLandmarks();
    });
  }

  async predictAUs(maskedFace) {
    return new Promise((resolve, reject) => {
      const auImage = new Image();
      auImage.onload = async () => {
        const inputImage = faceapi.tf.browser
          .fromPixels(auImage)
          .mean(2)
          .toFloat()
          .expandDims(0)
          .expandDims(-1);

        const predictions = await auModel.predict(inputImage).arraySync()[0];
        const predictedAUs = this.getActiveAUsFromPredictions(predictions);
        resolve(predictedAUs);
      };
      auImage.src = maskedFace;
      auImage.onerror = reject;
    });
  }

  async cropMaskImage(resizedFaceDetection) {
    const croppedRotatedFace = await this.cropRotateFace(resizedFaceDetection);
    const croppedRoatatedMaskedFace = await this.getMaskedFace(
      resizedFaceDetection,
      croppedRotatedFace
    );
    return croppedRoatatedMaskedFace;
  }

  async getMaskedFaceImage(resizedFaceDetection) {
    const det = resizedFaceDetection.detection._box;
    if (this.checkFaceInPicture(resizedFaceDetection)) {
      const maskedFace = await this.cropMaskImage(resizedFaceDetection);
      return maskedFace;
    } else {
      return;
      // throw new Error("face not fully in picture");
    }
  }

  getActiveAUsFromPredictions(predictions) {
    const auMeanings = [1, 2, 4, 5, 6, 9, 12, 15, 17, 20, 25, 26];
    return predictions
      .map((current, index) => {
        if (current == 1) {
          return auMeanings[index];
        }
      })
      .filter(function (element) {
        return element !== undefined;
      });
  }

  async cropRotateFace(resizedFaceDetection, useSide = "long", imageDims = 96) {
    // x,y = topleft x,y
    const x = resizedFaceDetection.detection._box._x;
    const y = resizedFaceDetection.detection._box._y;
    const width = resizedFaceDetection.detection._box._width;
    const height = resizedFaceDetection.detection._box._height;
    const angle = resizedFaceDetection.angle.roll;

    const tempCanvas1 = document.createElement("canvas");
    const tctx1 = tempCanvas1.getContext("2d");
    tempCanvas1.height = tempCanvas1.width = imageDims;
    tctx1.fillRect(0, 0, tempCanvas1.width, tempCanvas1.height);
    tctx1.translate(tempCanvas1.width / 2, tempCanvas1.height / 2);
    tctx1.strokeStyle = "orange";
    tctx1.rotate(angle / 64); // this is a hot fix check if correct, seems to be ok
    tctx1.translate(-tempCanvas1.width / 2, -tempCanvas1.height / 2);
    const longSideScale = Math.min(
      tempCanvas1.width / width,
      tempCanvas1.height / height
    );
    const shortSideScale = Math.max(
      tempCanvas1.width / width,
      tempCanvas1.height / height
    );
    let scale = useSide === "long" ? longSideScale : shortSideScale;
    tctx1.drawImage(
      this.image,
      x,
      y,
      width,
      height,
      0,
      0,
      width * scale,
      height * scale
    );

    let imgData = tctx1.getImageData(
      0,
      0,
      tctx1.canvas.width,
      tctx1.canvas.height
    );
    let pixels = imgData.data;
    for (var i = 0; i < pixels.length; i += 4) {
      let lightness = parseInt((pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3);
      pixels[i] = lightness;
      pixels[i + 1] = lightness;
      pixels[i + 2] = lightness;
    }
    tctx1.putImageData(imgData, 0, 0);
    return tempCanvas1.toDataURL();
  }

  async getMaskedFace(
    resizedFaceDetection,
    croppedRotatedFace,
    imageDims = 96
  ) {
    // canvas.width = this.getWidth();
    // canvas.height = this.getHeight();
    return new Promise((resolve, reject) => {
      const crfImage = new Image();
      const faceLandmarks = this.getRelativeLandmarks(resizedFaceDetection);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = 96;
      canvas.height = 96;
      crfImage.onload = () => {
        ctx.drawImage(crfImage, 0, 0);
        const margin = 0;
        ctx.beginPath();
        const fistCoordinateX = faceLandmarks[0][0] - margin;
        const fistCoordinateY = faceLandmarks[0][1];
        ctx.moveTo(fistCoordinateX, fistCoordinateY);
        for (let i = 1; i < 17; i++) {
          let currentCoordinate = faceLandmarks[i];
          let currentX = currentCoordinate[0];
          currentX = i < 8 ? currentX - margin : currentX + margin;
          let currentY = currentCoordinate[1];
          ctx.lineTo(currentX, currentY);
        }
        const rightBrowRightX = faceLandmarks[26][0];
        const rightBrowRightY = faceLandmarks[26][1];
        ctx.lineTo(rightBrowRightX + 10, rightBrowRightY - 3);
        const rightBrowMiddleX = faceLandmarks[20][0];
        const rightBrowMiddleY = faceLandmarks[20][1] - 8;
        ctx.lineTo(rightBrowMiddleX, rightBrowMiddleY - 3);
        const leftBrowMiddleX = faceLandmarks[25][0];
        const leftBrowMiddleY = faceLandmarks[25][1] - 8;
        ctx.lineTo(leftBrowMiddleX, leftBrowMiddleY - 3);
        const leftBrowLeftX = faceLandmarks[18][0];
        const leftBrowLeftY = faceLandmarks[18][1];
        ctx.lineTo(leftBrowLeftX - 10, leftBrowLeftY - 3);
        ctx.lineTo(fistCoordinateX, fistCoordinateY);
        ctx.lineTo(0, fistCoordinateY);
        ctx.lineTo(0, 0);
        ctx.lineTo(imageDims, 0);
        ctx.lineTo(imageDims, imageDims);
        ctx.lineTo(0, imageDims);
        ctx.lineTo(0, fistCoordinateY);
        ctx.closePath();
        ctx.fill();

        resolve(canvas.toDataURL());
      };
      crfImage.onerror = reject;
      crfImage.src = croppedRotatedFace;
    });
  }

  async getFaceDetection() {
    if (this.detections == undefined) {
      this.detections = await faceapi
        .detectSingleFace(this.getImage())
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender();
    }
    return this.detections;
  }

  async getLandmarks() {
    await this.getResizedFaceDetection().then(async (resizedFaceDetection) => {
      this.landmarks = new Landmarks(
        resizedFaceDetection.landmarks._positions,
        resizedFaceDetection.angle.roll,
        await this.resizedFaceDetection.detection._box
      );
    });
    return this.landmarks;
  }

  async getResizedFaceDetection() {
    if (this.resizedFaceDetection == undefined) {
      await this.getFaceDetection().then(async (faceDetection) => {
        this.resizedFaceDetection = await faceapi.resizeResults(
          faceDetection,
          this.getDisplaySize()
        );
      });
    }
    return await this.resizedFaceDetection;
  }

  async getFaceBoundingBox() {
    if (this.faceBoundingBox == undefined) {
      await this.getResizedFaceDetection().then(
        async (resizedFaceDetection) => {
          return await resizedFaceDetection.detection._box;
        }
      );
    }
  }

  async getAbsoluteLandmarks() {
    await this.getLandmarks().then(async (landmarks) => {
      this.absoluteLandmarks = landmarks.getAbsoluteLandmarks();
    });
    return this.absoluteLandmarks;
  }

  getRelativeLandmarks(resizedFaceDetection, imageDims = 96) {
    function getNewCoords(
      x,
      y,
      boundingBoxUpperLeftX,
      boundingBoxUpperLeftY,
      width,
      height
    ) {
      x = x - boundingBoxUpperLeftX;
      y = y - boundingBoxUpperLeftY;
      const longSide = Math.max(width, height);
      const ratio = imageDims / longSide;
      const newX = x * ratio;
      const newY = y * ratio;
      return [newX, newY];
    }

    const angle = resizedFaceDetection.angle.roll / 64;
    const posL = resizedFaceDetection.landmarks._positions;

    // First scale the landmarks

    const landmarkList = [];
    for (let i = 0; i < posL.length; i++) {
      landmarkList.push(
        getNewCoords(
          posL[i]._x,
          posL[i]._y,
          resizedFaceDetection.detection._box._x,
          resizedFaceDetection.detection._box._y,
          resizedFaceDetection.detection._box._width,
          resizedFaceDetection.detection._box._height
        )
      );
    }

    // Now rotate the landmarks
    const rotatedLandmarks = [];
    const cosAlpha = Math.cos(angle);
    const sinAlpha = Math.sin(angle);

    for (let i = 0; i < landmarkList.length; i++) {
      const currentX = landmarkList[i][0] - 56;
      const currentY = landmarkList[i][1] - 56;
      const newX = currentX * cosAlpha - currentY * sinAlpha;
      const newY = currentX * sinAlpha + currentY * cosAlpha;
      rotatedLandmarks.push([newX + 56, newY + 56]);
    }

    return rotatedLandmarks;
  }

  getImage() {
    return this.image;
  }

  getHeight() {
    return this.image.height;
  }

  getWidth() {
    return this.image.width;
  }

  getDisplaySize() {
    return { width: this.getWidth(), height: this.getHeight() };
  }

  checkFaceInPicture(resizedFaceDetection) {
    const faceBoundingBox = resizedFaceDetection.detection._box;
    if (
      faceBoundingBox._x < 0 ||
      faceBoundingBox._y < 0 ||
      faceBoundingBox._x + faceBoundingBox._width > this.getWidth() ||
      faceBoundingBox._y + faceBoundingBox._height > this.getHeight()
    ) {
      return false;
    } else {
      return true;
    }
  }
}
