loadModels()

async function loadModels(){
    console.log("FaceAPI Models are loading")
    await faceapi.nets.faceLandmark68Net.loadFromUri('/static/models/');
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/static/models/');
    await faceapi.nets.faceExpressionNet.loadFromUri('/static/models/');
    await faceapi.nets.ageGenderNet.loadFromUri('/static/models/');
}

async function generateStatus(img, gameplayId, sessionId, isPreheat){
    let statusVector = {
        emotions: "", // emotion
        landmarks: [], // list of lists of length 2 of length 68
        hogs: [], // list of 5408 
        gender: "",
        age: "",
        faceBbox: "",
        imageDims: "",
        error: ""
    };
    var image = document.createElement('img');
    image.src = img;
    image.onload = async () => {
        const displaySize = {width: image.width, height: image.height};
        const detections = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceExpressions().withAgeAndGender(); 
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        const det = resizedDetections.detection._box;
        if (checkFullFaceInPicture(det._x, det._y, det._width, det._height, image.width, image.height)) {
            const resizedLandmarks = resizeLandmarks(resizedDetections.landmarks._positions, det);
            statusVector.landmarks = rotateLandmarks(resizedLandmarks, resizedDetections.angle.roll);
            statusVector.emotions = resizedDetections.expressions;
            const maskedFace = await maskFace(statusVector.landmarks, image);
            statusVector.hogs = await getHogs(maskedFace);
            statusVector.gender = `${resizedDetections.gender} (${resizedDetections.genderProbability.toFixed(2)})`;
            statusVector.age = `${resizedDetections.age.toFixed(2)}`;
            statusVector.faceBbox = `${det._x}, ${det._y}, ${det._width}, 
                                    ${det._height}`;
            statusVector.imageDims = `${image.width, image.height}`

        } else {
            statusVector.error = "face not fully in picture";
        }      
        if (!isPreheat){
            sendStatusVector(statusVector, gameplayId, sessionId); 
            console.log("Status sent to server!");
        }
    }
}

function resizeLandmarks(landmarks,  det) {
    const landmarkList = [];
    for (let i = 0; i < landmarks.length; i++) {
      landmarkList.push(getNewCoords(landmarks[i]._x, landmarks[i]._y, det._x, det._y, det._width, det._height));
    }
    return landmarkList;
}

function getNewCoords(x, y, boundingBoxUpperLeftX, boundingBoxUpperLeftY, width, height){
    x = x - boundingBoxUpperLeftX;
    y = y - boundingBoxUpperLeftY;
    const longSide = Math.max(width, height);
    const ratio = (112/longSide);
    const newX = x * ratio;
    const newY = y * ratio;
    return [newX.toFixed(3), newY.toFixed(3)];
}

function rotateLandmarks(landmarks, angle) {
    const rotatedLandmarks = []
    cosAlpha = Math.cos(angle);
    sinAlpha = Math.sin(angle);
  
    for (let i = 0; i < landmarks.length; i++) {
      currentX = landmarks[i][0] - 56;
      currentY = landmarks[i][1] - 56;
  
      newX = currentX * cosAlpha - currentY * sinAlpha;
      newY = currentX * sinAlpha + currentY * cosAlpha;
  
      rotatedLandmarks.push([newX + 56, newY + 56]);
    }
    return rotatedLandmarks;
}

async function maskFace(faceLandmarks, image) {
    const canvas = document.createElement("canvas");    
    const ctx = canvas.getContext("2d");
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
    const margin = 0;
    ctx.beginPath();
    const fistCoordinateX = faceLandmarks[0][0] - margin;
    const fistCoordinateY = faceLandmarks[0][1];
    ctx.moveTo(fistCoordinateX, fistCoordinateY);
    for (let i = 1; i < 17; i++) {
        currentCoordinate = faceLandmarks[i];
        currentX = currentCoordinate[0];
        currentX = i < 8 ? currentX - margin : currentX + margin;
        currentY = currentCoordinate[1];
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
    ctx.lineTo(0, fistCoordinateY)
    ctx.lineTo(0, 0);
    ctx.lineTo(112, 0);
    ctx.lineTo(112, 112);
    ctx.lineTo(0, 112);
    ctx.lineTo(0, fistCoordinateY);
    ctx.closePath();
    ctx.fill();
    return IJS.Image.load(canvas.toDataURL("image/png"));
}

async function getHogs(maskedFaceImage) {
    var options = {
      cellSize: 8,    // length of cell in px
      blockSize: 2,   // length of block in number of cells
      blockStride: 1, // number of cells to slide block window by (block overlap)
      bins: 8,        // bins per histogram (=orientations)
      norm: 'L2-hys'      // block normalization method (=standard in hog())
    }
    var hogs = extractHOG(maskedFaceImage, options);
    hogs = hogs.map(function (x) {
      return Number(x.toFixed(3));
    });
    return hogs;
}

function checkFullFaceInPicture(x, y, faceWidth, faceHeight, imageWidth, imageHeight) {
    if ((x < 0) || (y < 0) || (x + faceWidth > imageWidth) || (y + faceHeight > imageHeight)) {
      return false;
    } else {
      return true;
    }
}