// Supported AUs 1, 2, 4, 5, 6, 7, 9, 10, 12, 14, 15, 17, 18, 20, 23, 24, 25,
// 26, 28, 43


const auLandmarkMap2 = {
    "1": [21],
    "2": [18],
    "4": [19],
    "6": [40, 40, 40, 40, 41, 41, 41, 41, 6], // updated
    "5": [44],
    "7": [44], // updated
    "9": [32, 32, 32, 50],
    "10": [50, 52], // updated
    "11": [30, 30, 35, 35, 16], // updated
    "12": [48],
    "14": [48, 48, 48, 48, 3, 4], // updated
    "15": [48, 48, 48, 48, 4, 5],
    "16": [57],
    "17": [8],
    "18": [62],
    "20": [48],
    "22": [62],
    "23": [48],
    "24": [51],
    "25": [51, 57],
    "26": [8],
    "27": [57],
    "28": [62],
    "41": [43],
    "42": [43],
    "43": [37],
    "44": [37],
    "45": [37],
    "46": [37]
}

function checkAUs(activeAUs, targetAUs) {
    const falsePositiveAUs = [];
    const falseNegativeAUs = [];
    const correctAUs = [];
    targetAUs.forEach(au => {
        if (!(activeAUs.includes(au))) {
            falseNegativeAUs.push(au);
        }
    })
    activeAUs.forEach(au => {
        if (!(targetAUs.includes(au))) {
            falsePositiveAUs.push(au);
        }
    })

    targetAUs.forEach(au => {
        if (activeAUs.includes(au)) {
            correctAUs.push(au);
        }
    })

    return {
        "falsePositive": falsePositiveAUs,
        "falseNegative": falseNegativeAUs,
        "correct": correctAUs,
    };
}


function drawAUs(canvas, goldActionUnits, userActionUnits, landmarks, drawCorrectAUs) {

    const checkedAUs = checkAUs(userActionUnits, goldActionUnits);
    const falseNegativeAUs = checkedAUs["falseNegative"];
    const falsePositiveAUs = checkedAUs["falsePositive"];
    const correctAUs = checkedAUs["correct"];



    const actionUnits = sortAUsByLocations(userActionUnits.concat(goldActionUnits), landmarks);



    actionUnits.forEach(actionUnit => {
        const drawType =
            falseNegativeAUs.includes(actionUnit) ? "short_prescription" :
            falsePositiveAUs.includes(actionUnit) ? "short_prescription_negative" :
            "short_description";

        if (drawType != "short_description" || drawCorrectAUs) {
            drawAU(actionUnit, drawType);
        }

    });

    function drawAU(actionUnit, textKind) {



        const colorDict = {
            "short_description": "#00FF00",
            "short_prescription": "rgba(90, 169, 230, 0.75)",
            "short_prescription_negative": "rgba(255, 99, 146, 0.75)"
        };

        const fontColor = colorDict[textKind];

        const text = getText(actionUnit, textKind);
        const pointerLocation = getPointerLocation(actionUnit, landmarks);
        const textLocation = getTextBox(pointerLocation);

        // console.assert(fontColor, text, pointerLocation, textLocation)

        if (textLocation.textBoxNr != 404) {
            fillTextBackground(canvas, 9, textLocation.x, textLocation.y, text, fontColor);
            placeTextOnCanvas(canvas, 9, "#000000", textLocation.x, textLocation.y, pointerLocation.x, pointerLocation.y, text);
        }
    }

}

function sortAUsByLocations(actionUnits, landmarks) {
    // const order = [1, 4, 2, 6, 9, 10, 14, 23, 12, 15, 16, 27, 12, 26, 28, 22, 18, 24, 25, 13, 11, 5, 7, 41, 42, 43, 44, 45, 46];
    // const order = [6, 2, 5, 1, 7, 4, 41, 12, 26, 42, 43, 14, 44, 45, 23, 15, 10, 24, 18, 22, 28, 11, 13, 27];

    const sortedYValues = []

    actionUnits.forEach(au => {
        const involvedLandmarks = getLandmarksByNr(landmarks, auLandmarkMap2[au])
        sortedYValues.push([getMiddle(involvedLandmarks).y, au]);
    })

    // sortedYValues.sort {
    //     $0 .0 == $1 .0 ? $0 .1 > $1 .1 : $0 .0 > $1 .0
    // }

    return sortedYValues.map((pair) => {
        return pair[1];
    })
}

function fillTextBackground(canvas, textSize, textX, textY, text, color) {
    let textWidth = 0;
    text.forEach(line => {
        textWidth = Math.max(textWidth, line.length);
    })
    textWidth *= 0.80 * textSize;
    const numberOfLines = text.length;
    const ctx = canvas.getContext("2d");
    const lineHeight = textSize + 1;
    // ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillStyle = color;
    ctx.fillRect(textX - 3, textY - lineHeight, textWidth, (1 + numberOfLines) * lineHeight);
    ctx.strokeStyle = color;
    ctx.strokeRect(textX - 3, textY - lineHeight, textWidth, (1 + numberOfLines) * lineHeight);
}

function placeTextOnCanvas(canvas, fontSize, fontColor, textX, textY, pointerX, pointerY, textArray) {
    const ctx = canvas.getContext("2d");
    const left = textX < canvas.width / 2;
    ctx.font = `${fontSize}pt Monospace`;
    let i = 0;
    textArray.forEach(lineOfText => {
        if (i === 0) {
            const xOffset = left ? lineOfText.length * fontSize * 0.76 : -1;
            ctx.beginPath();
            ctx.moveTo(textX + xOffset, textY);
            ctx.lineTo(pointerX, pointerY);
            ctx.closePath();
            ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
            ctx.stroke();
            ctx.strokeStyle = "#000000";
        }
        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.fillText(lineOfText, textX, textY + 0.5 * fontSize + i * (fontSize + 1));
        i++;

    })

}

function getText(actionUnit, textKind) {
    const text = prescriptionDict[actionUnit.toString()][textKind][0];
    return linebreakList(text, 18);
}

function linebreakList(str, maxLineLength) {
    const wordList = str.split(" ");
    const sentenceList = [];
    let newString = "";
    let i = 0;
    while (i < wordList.length) {
        if ((newString.length + wordList[i].length) < maxLineLength) {
            newString += wordList[i] + " ";
        } else {
            sentenceList.push(newString);
            newString = wordList[i] += " "
        }
        i++;
    }
    sentenceList.push(newString);
    return sentenceList;
}

function getTextBox(pointer) {

    const textBoxes = [
        [0, 200, 70],
        [1, 25, 80],
        [2, 25, 130],
        [3, 25, 180],
        [4, 25, 230],
        [5, 25, 280],
        [6, 25, 330],
        [7, 330, 80],
        [8, 330, 130],
        [9, 330, 180],
        [10, 330, 230],
        [11, 330, 280],
        [12, 330, 330]
    ]

    let distances = [];

    textBoxes.forEach(textBox => {
        if (!booked.includes(textBox[0])) {
            const xOffset = (textBox[0] > 0) ? textBox[0] < 7 ? 140 : textBox[0] > 7 ? -40 : 0 : 0;
            distances.push([textBox[0], getDistance([pointer.x, pointer.y], [textBox[1] + xOffset, textBox[2]])]);
        }
    })

    if (distances.length > 0) {
        let minDist = 500;
        let bestBox;
        distances.forEach((box) => {
            const boxNr = box[0];
            const distance = box[1];
            if (distance < minDist) {
                bestBox = boxNr;
                minDist = distance;
            }
        })
        booked.push(bestBox);
        return {
            textboxNr: bestBox,
            x: textBoxes[bestBox][1],
            y: textBoxes[bestBox][2]
        }
    } else {
        return {
            textboxNr: 404,
            x: 0,
            y: 0
        }
    }

}

function getDistance(pointA, pointB) {
    return Math.sqrt(Math.pow((pointB[0] - pointA[0]), 2) + Math.pow((pointB[1] - pointA[1]), 2));
}

function getPointerLocation(au, landmarks) {
    if (Object.keys(auLandmarkMap2).includes(au.toString())) {
        const involvedLandmarks = getLandmarksByNr(landmarks, auLandmarkMap2[au])
        return getMiddle(involvedLandmarks);
    } else {
        return {
            x: 0,
            y: 0
        }
    }
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
        x: xSum / nrPoints,
        y: ySum / nrPoints
    };
}

function getLandmarksByNr(landmarks, listOfLandmarkNumbers) {
    landmarksList = [];
    listOfLandmarkNumbers.forEach(nr => {
        landmarksList.push(landmarks[nr]);
    })
    return landmarksList;
}