const canvasVideo = document.getElementById("canvas-video");
document.getElementById("canvas-snapshot").style.display = "inline-block";

startWebcamChooser().then(loadModels());

document.getElementById("snapshot-btn").addEventListener("click", startNewMirror);

function startNewMirror() {
    clearDisplay();
    ctxCanvasSnapshot.drawImage(canvasVideo, 0, 0);
    const snapshot = canvasSnapshot.toDataURL("image/png");
    const actionUnitData = requestActionUnits(snapshot, 0, 0, 0, false, false);
    actionUnitData.then(auData => {
        console.log(auData);
        //document.getElementById("your-aus").innerHTML = auData.actionUnits;
        displayAUs(auData);
        showHeatmap([], auData.actionUnits, canvasSnapshot);

    }); //waits for the promise to be returned
}

function displayAUs(auData) {
    if (auData.success) {
        document.getElementById("canvas-heatmap").style.display = "inline-block";
        document.getElementById("your-aus").innerHTML = auData.actionUnits;
        document.getElementById("natural-language").innerHTML = fee(auData.actionUnits);
    } else {
        document.getElementById("natural-language").innerHTML = "";
        document.getElementById("your-aus").style.display = "";
        document.getElementById("error-msg").innerHTML = auData.errorMessage;
    }
}

function clearDisplay() {
    document.getElementById("error-msg").innerHTML = "";
    document.getElementById("natural-language").innerHTML = "";
    document.getElementById("your-aus").innerHTML = "";
    document.getElementById("canvas-heatmap").style.display = "none";
}