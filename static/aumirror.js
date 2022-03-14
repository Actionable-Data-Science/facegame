startWebcamChooser();

document.getElementById("snapshot-btn").addEventListener("click", startNewMirror);

function startNewMirror(){
  const snapshot = canvasSnapshot.toDataURL("image/png");
  const actionUnitData = requestActionUnits(snapshot, 0, 0, 0, false, false);
  actionUnitData.then(auData  => {
    console.log(auData);
    //document.getElementById("your-aus").innerHTML = auData.actionUnits;
    displayAUs(auData);

    showHeatmap([], auData.actionUnits, canvasSnapshot);

  }); //waits for the promise to be returned
}

function displayAUs(auData){
  if (auData.success){
    document.getElementById("your-aus").innerHTML = auData.actionUnits;
  }  else {
    document.getElementById("error-msg").innerHTML = auData.errorMessage;
  }
}
