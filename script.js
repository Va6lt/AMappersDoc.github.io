body {
    margin: 0;
    font-family: "Times New Roman", serif;
    background: #000;
    color: #eaeaea;
    display: flex;
    height: 100vh;
}

#preview {
    flex: 2;
    position: relative;
    overflow-y: auto;
}

#bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
}

#script {
    position: relative;
    z-index: 1;
    padding: 20px;
}

.line {
    display: flex;
    align-items: flex-start;
    margin-bottom: 8px;
}

.flag {
    width: 28px;
    height: 18px;
    margin-right: 10px;
    object-fit: cover;
}

.country { font-weight: bold; }
.timestamp { color: #aaa; margin-left: 6px; font-size: 0.9em; }
.remove { margin-left: 8px; cursor: pointer; color: #777; }

#controls {
    flex: 1;
    background: #111;
    border-left: 1px solid #333;
    padding: 15px;
    overflow-y: auto;
}

label {
    display: block;
    margin-top: 10px;
    font-size: 14px;
}

input, textarea, select, button {
    width: 100%;
    background: #222;
    color: #fff;
    border: 1px solid #444;
    padding: 6px;
    margin-top: 4px;
    font-family: "Times New Roman", serif;
}

button { margin-top: 10px; cursor: pointer; }

input[type="range"] {
    -webkit-appearance: none;
    height: 4px;
    background: linear-gradient(to right, #666, #bbb);
    border-radius: 4px;
}
input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #e0e0e0;
    box-shadow: 0 0 6px rgba(255,255,255,0.6);
}
