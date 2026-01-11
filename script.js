// Firebase config — replace with your own Firebase project info
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let state = {
    speakers: {},
    lines: [],
    bg: "",
    blur: 0,
    borderSize: 1,
    borderColor: "#aaaaaa",
    glow: false,
    textSize: 16
};

const scriptEl = document.getElementById("script");
const bgEl = document.getElementById("bg");
const speakerSelect = document.getElementById("speakerSelect");

function render() {
    scriptEl.innerHTML = "";
    state.lines.forEach((l, i) => {
        const line = document.createElement("div");
        line.className = "line";
        line.style.fontSize = state.textSize + "px";

        const img = document.createElement("img");
        img.className = "flag";
        img.src = l.flag;
        img.style.border = `${state.borderSize}px solid ${state.borderColor}`;
        img.style.boxShadow = state.glow ? `0 0 8px ${state.borderColor}` : "none";

        const text = document.createElement("div");
        text.innerHTML = l.html;

        const del = document.createElement("span");
        del.className = "remove";
        del.textContent = "✖";
        del.onclick = () => {
            const key = Object.keys(state.linesDB)[i];
            db.ref("lines/" + key).remove();
        };

        line.append(img, text, del);
        scriptEl.appendChild(line);
    });

    bgEl.style.backgroundImage = state.bg;
    bgEl.style.filter = `blur(${state.blur}px)`;
}

function updateSpeakers() {
    speakerSelect.innerHTML = "";
    Object.keys(state.speakers).forEach(k => {
        const o = document.createElement("option");
        o.value = k;
        o.textContent = k;
        speakerSelect.appendChild(o);
    });
}

// Listeners
document.getElementById("addSpeakerBtn").onclick = () => {
    const name = document.getElementById("countryName").value;
    const file = document.getElementById("flagUpload").files[0];
    if (!name || !file) return;

    const r = new FileReader();
    r.onload = () => {
        db.ref("speakers/" + name).set(r.result);
    };
    r.readAsDataURL(file);
};

document.getElementById("addLineBtn").onclick = () => {
    const s = speakerSelect.value;
    const text = document.getElementById("lineText").value;
    const ts = document.getElementById("timestamp").value;
    if (!s || !text) return;

    const newLine = {
        flag: state.speakers[s],
        html: `<span class="country">${s}:</span> ${text}${ts ? `<span class="timestamp">${ts}</span>` : ""}`
    };
    db.ref("lines").push(newLine);

    document.getElementById("lineText").value = "";
    document.getElementById("timestamp").value = "";
};

// Style controls
document.getElementById("blurRange").oninput = e => db.ref("settings/blur").set(Number(e.target.value));
document.getElementById("textSizeRange").oninput = e => db.ref("settings/textSize").set(Number(e.target.value));
document.getElementById("borderRange").oninput = e => db.ref("settings/borderSize").set(Number(e.target.value));
document.getElementById("borderColor").oninput = e => db.ref("settings/borderColor").set(e.target.value);
document.getElementById("glowToggle").onchange = e => db.ref("settings/glow").set(e.target.checked);

// Background
document.getElementById("setBgBtn").onclick = () => {
    const file = document.getElementById("bgUpload").files[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => db.ref("settings/bg").set(`url('${r.result}')`);
    r.readAsDataURL(file);
};

// Firebase listeners
db.ref("speakers").on("value", snap => {
    state.speakers = snap.val() || {};
    updateSpeakers();
});

db.ref("lines").on("value", snap => {
    state.linesDB = snap.val() || {};
    state.lines = Object.values(state.linesDB);
    render();
});

db.ref("settings").on("value", snap => {
    const s = snap.val() || {};
    state.bg = s.bg || "";
    state.blur = s.blur || 0;
    state.textSize = s.textSize || 16;
    state.borderSize = s.borderSize || 1;
    state.borderColor = s.borderColor || "#aaaaaa";
    state.glow = s.glow || false;
    render();
});
