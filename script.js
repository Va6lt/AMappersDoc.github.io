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

function save() {
    localStorage.setItem("countryScript", JSON.stringify(state));
}

function load() {
    const saved = localStorage.getItem("countryScript");
    if (saved) {
        state = JSON.parse(saved);
        updateSpeakers();
        render();
    }
}

/* ===== RENDERING ===== */
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
            state.lines.splice(i, 1);
            save();
            render();
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

/* ===== EVENT LISTENERS ===== */
document.getElementById("addSpeakerBtn").onclick = () => {
    const name = document.getElementById("countryName").value;
    const file = document.getElementById("flagUpload").files[0];
    if (!name || !file) return;

    const reader = new FileReader();
    reader.onload = () => {
        state.speakers[name] = reader.result;
        updateSpeakers();
        save();
    };
    reader.readAsDataURL(file);
};

document.getElementById("addLineBtn").onclick = () => {
    const s = speakerSelect.value;
    const text = document.getElementById("lineText").value;
    const ts = document.getElementById("timestamp").value;
    if (!s || !text) return;

    state.lines.push({
        flag: state.speakers[s],
        html: `<span class="country">${s}:</span> ${text}${ts ? `<span class="timestamp">${ts}</span>` : ""}`
    });

    document.getElementById("lineText").value = "";
    document.getElementById("timestamp").value = "";
    save();
    render();
};

/* ===== BACKGROUND ===== */
document.getElementById("setBgBtn").onclick = () => {
    const file = document.getElementById("bgUpload").files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        state.bg = `url('${reader.result}')`;
        save();
        render();
    };
    reader.readAsDataURL(file);
};

/* ===== STYLING ===== */
document.getElementById("blurRange").oninput = e => { state.blur = e.target.value; save(); render(); };
document.getElementById("textSizeRange").oninput = e => { state.textSize = e.target.value; save(); render(); };
document.getElementById("borderRange").oninput = e => { state.borderSize = e.target.value; save(); render(); };
document.getElementById("borderColor").oninput = e => { state.borderColor = e.target.value; save(); render(); };
document.getElementById("glowToggle").onchange = e => { state.glow = e.target.checked; save(); render(); };

/* ===== EXPORT / IMPORT JSON (optional collaboration) ===== */
document.getElementById("exportJSONBtn").onclick = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "country_script.json";
    a.click();
};

document.getElementById("importJSON").onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        state = JSON.parse(reader.result);
        updateSpeakers();
        render();
        save();
    };
    reader.readAsText(file);
};

/* ===== INIT ===== */
load();

