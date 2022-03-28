const canvasSnapshot = document.getElementById("canvas-snapshot");
const ctxCanvasSnapshot = canvasSnapshot.getContext("2d");
const canvasHeatmap = document.getElementById("canvas-heatmap");
const ctxCanvasHeatmap = canvasHeatmap.getContext("2d");


async function requestActionUnits(image, gameplayId, sessionId, goldId, isPreheat, isGame) {
    const apiURL = "/api/getActionUnits";
    const data = { "base64image": image, "gameplayId": gameplayId, "sessionId": sessionId, "goldId": goldId, "isPreheat": isPreheat, "isGame": isGame };
    let res = await fetch(apiURL, {
        method: "POST", mode: 'cors',
        headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    });
    let json = await res.json();
    return json;
}

async function getSessionId() {
    const apiURL = "/api/getSessionId";
    let res = await fetch(apiURL, {
        method: "GET"
    });
    await res.json().then(json => {
        console.log("Session ID: ", json.sessionId);
        currentSessionId = json.sessionId;
    });
    return currentSessionId;
}

