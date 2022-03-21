document.getElementById("send-btn").addEventListener("click", sendBugReport);

async function sendBugReport() {
    const bugDescription = document.getElementById("bug-input-text").value;
    const apiURL = "/api/sendBugReport";
    const data = {
        "bugDescription": bugDescription,
        userAgent: navigator.userAgent
    };
    let res = await fetch(apiURL, {
        method: "POST",
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (res.status == 200) {
        let json = await res.json();
        showBugSent(true, json["bugId"]);
    } else {
        showBugSent(false, 0);
    }

}

async function requestActionUnits(image, gameplayId, sessionId, goldId, isPreheat, isGame) {
    const data = {
        "base64image": image,
        "gameplayId": gameplayId,
        "sessionId": sessionId,
        "goldId": goldId,
        "isPreheat": isPreheat,
        "isGame": isGame
    };
    let res = await fetch(apiURL, {
        method: "POST",
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    let json = await res.json();
    return json;
}

function showBugSent(success, bugId) {
    document.getElementById("send-btn").style.display = "none";
    document.getElementById("bug-input-text").style.display = "none";
    document.getElementById("bug-sent-text").innerHTML = success ?
        `Your bug report was sent successfully! Thank you for helping us improve facegame. Here is a virtual cookie for your efforts: 🍪.\n\nThe ID for this bug is: ${bugId}` :
        "OH NO! There was a bug while reporting the bug! Welcome to the matrix!";
}