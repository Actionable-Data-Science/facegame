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

let heat = simpleheat(document.getElementById("canvas-heatmap"));
const heatval = 0.8
heat.radius(8, 4); // setting point and blur radius (3, 2)

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

async function showHeatmap(correctAUs, playerAUs, image) {
    const falseAUs = getFalseAUsHeatmap(correctAUs, playerAUs);
    detection = await faceapi.detectSingleFace(image).withFaceLandmarks();
    const data = generateHeatmapData(falseAUs, detection.landmarks._positions);
    heat.data(data)
    // heat.draw(0.01);
    // changeCanvasAlpha(canvasHeatmap, 43);
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
    return {
        "_x": xSum / nrPoints,
        "_y": ySum / nrPoints
    };
}


function getFalseAUsHeatmap(correctAUs, playerAUs) {
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