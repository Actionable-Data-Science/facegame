const requests = ["description", "prescription", "prescription_negative"];

function auEncoding(listAu) {
  listAuEncoded = ["0"];
  for (let i = 1; i < 47; i++) {
    listAuEncoded[i] = listAu.includes(i) ? "1" : "0";
  }
  return listAuEncoded;
}

function getRandomFromList(list) {
  const l = list.length;
  return list[0]; // not randomized for the study
}

function codeFromActive(listAuEncoded, listOfAUsToCode) {
  let code = "";
  listOfAUsToCode.forEach((au) => {
    code += listAuEncoded[au];
  });
  return code;
}

function getFalseAUs(activeAUs, targetAUs) {
  const falsePositiveAUs = [];
  const falseNegativeAUs = [];
  targetAUs.forEach((au) => {
    if (!activeAUs.includes(au)) {
      falseNegativeAUs.push(au);
    }
  });
  activeAUs.forEach((au) => {
    if (!targetAUs.includes(au)) {
      falsePositiveAUs.push(au);
    }
  });
  return {
    falsePositive: falsePositiveAUs,
    falseNegative: falseNegativeAUs,
  };
}

function listOfStringsToString(listOfStrings) {
  let string = "";
  listOfStrings.forEach((str) => {
    string += str;
  });
  return string;
}

function fee(activeAUs, targetAUs) {
  let retVal = "";
  if (typeof targetAUs == "undefined") {
    console.log("No target AUs specified. Describing!");
    retVal = faceExpressionToNaturalLanguage(activeAUs, "description");
  } else {
    const falseAUs = getFalseAUs(activeAUs, targetAUs);
    const todo = faceExpressionToNaturalLanguage(
      falseAUs["falseNegative"],
      (ask_for = "prescription")
    );
    const notTodo = faceExpressionToNaturalLanguage(
      falseAUs["falsePositive"],
      (ask_for = "prescription_negative")
    );
    retVal = todo + notTodo;
  }
  if (retVal.length > 1) {
    // retVal = listOfStringsToString(retVal);
    retVal = retVal.replaceAll(".", ". ");
  } else {
    retVal = "You are a true master of action units!";
  }
  return retVal;
}

function generatePrescriptionTable(activeAUs, targetAUs) {
  console.log("ACTIVE/TARGET:", activeAUs, targetAUs);

  function generateRow(au, type) {
    const auText = prescriptionDict[au][type];
    const newRow = `
    <tr>
      <td>${au}</td>
      <td>${auText[0]}</td>
      <td>
        <img style="height: 120px;" src='/static/gifs/au${au}.gif'/>
      </td>
    <tr>
    `;
    return newRow;
  }

  let tableInnerHTML = `
    <tr>
      <th>Action Unit</th>
      <th>Natural Language Description</th>
      <th>Gif</th>
    </tr>
  `;
  const falseAUs = getFalseAUs(activeAUs, targetAUs); // { "falsePositive": falsePositiveAUs, "falseNegative": falseNegativeAUs }

  const todo = falseAUs["falseNegative"];
  const notTodo = falseAUs["falsePositive"];

  todo.forEach((au) => {
    tableInnerHTML += generateRow(au, "prescription");
  });

  notTodo.forEach((au) => {
    tableInnerHTML += generateRow(au, "prescription_negative");
  });

  return tableInnerHTML;
}

function faceExpressionToNaturalLanguage(listAu, askFor = "description") {
  let retVal = "";
  if (!requests.includes(askFor)) {
    console.log(
      "Selected type of information does not exist in the dictionary."
    );
  } else if (listAu.length == 0) {
    console.log("The AU list is empty");
  } else {
    const listAuEncoded = auEncoding(listAu);
    const l = listAuEncoded;

    // *** Upper Face ***

    // Brows
    // au1 - inner brow raiser, au2 - outer brow raiser, au4 - brow lowerer
    const browCode = codeFromActive(l, [1, 2, 4]);
    const browInfo = feeDictionary["eyebrows"][browCode][askFor];

    // Cheeks
    // au6 - cheek raiser, au13 - cheek puffer
    const cheekCode = codeFromActive(l, [6, 13]);
    const cheekInfo = feeDictionary["cheeks"][cheekCode][askFor];

    // Eyes and eyelids
    // au5 - upper lid raiser, au7 - lid tightener, au43 - eyes closed
    const eyelidCode = codeFromActive(l, [5, 7, 43]);
    const eyelidInfo = feeDictionary["eyelids"][eyelidCode][askFor];

    // *** Lower Face - Up/Down Actions

    // Chin and Nose
    // au9 - nose wrinkler, au17 - chin raiser
    const lowerFaceUpdownChinnoseCode = codeFromActive(l, [9, 17]);
    const chinNoseInfo =
      feeDictionary["chin_nose"][lowerFaceUpdownChinnoseCode][askFor];

    // Lips
    // au10 - upper lip raiser, au15 - lip corner depressor, au16 - lower lip depressor
    const lowerFaceUpdownLipsFingerprint = codeFromActive(l, [10, 15, 16]);
    const lipsInfo =
      feeDictionary["lips"][lowerFaceUpdownLipsFingerprint][askFor];

    // Mouth
    // au25 - lips part, au26 - jaw drop, au27 - mouth stretch
    const lowerFaceUpdownMouthFingerprint = codeFromActive(l, [25, 26, 27]);
    const mouthInfo =
      feeDictionary["mouth"][lowerFaceUpdownMouthFingerprint][askFor];

    // *** Lower Face - Horizontal Actions ***
    // au20 - lip stretcher, au14 - dimpler
    const lowerFaceHorizontalCode = codeFromActive(l, [20, 14]);
    const horizontalInfo =
      feeDictionary["horizontal"][lowerFaceHorizontalCode][askFor];

    // *** Lower Face - Oblique Actions ***
    // au11 - nasolabial deepener, au12 - lip corner puller
    const lowerFaceObliqueCode = codeFromActive(l, [11, 12]);
    const obliqueInfo = feeDictionary["oblique"][lowerFaceObliqueCode][askFor];

    // *** Lower Face - Orbital Actions ***
    // au23 - lip tightener, au24 - lip presser, au28 - lip suck
    const lowerFaceOrbitalCode = codeFromActive(l, [23, 24, 28]);
    const orbitalInfo = feeDictionary["orbital"][lowerFaceOrbitalCode][askFor];

    retVal =
      getRandomFromList(browInfo) +
      getRandomFromList(cheekInfo) +
      getRandomFromList(eyelidInfo) +
      getRandomFromList(chinNoseInfo) +
      getRandomFromList(lipsInfo) +
      getRandomFromList(mouthInfo) +
      getRandomFromList(horizontalInfo) +
      getRandomFromList(obliqueInfo) +
      getRandomFromList(orbitalInfo);
  }
  return retVal;
}
