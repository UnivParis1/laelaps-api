"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const tf = __importStar(require("tableify"));
let running = false, jobId = null, textArea, parseButton, parseButtonIcon, clearButton, preloadIcon, resultContainer = null;
const isEmpty = () => {
    return !!textArea.value.match(/^\s*$/);
};
const POLLING_DELAY = 1000;
function pollServer() {
    if (!jobId)
        return;
    setTimeout(askForJobState, POLLING_DELAY);
}
const askForJobState = () => {
    axios_1.default.get(`/api/parsing/${jobId}`, { params: { reference: textArea.value } })
        .then(function (response) {
        jobId = response.data;
        if (response.data) {
            resultContainer.innerHTML = tf(response.data['parsing']);
            resultContainer.querySelectorAll("table")[0].classList.add("table", "table-striped");
            jobId = null;
            running = false;
            updateButtonState();
        }
        pollServer();
    })
        .catch(function (error) {
        // handle error
        console.log(error);
    });
};
const updateButtonState = () => {
    parseButton.disabled = isEmpty();
    clearButton.disabled = isEmpty();
    parseButtonIcon.style.visibility = running ? "hidden" : "visible";
    preloadIcon.style.visibility = !running ? "hidden" : "visible";
};
document.addEventListener("DOMContentLoaded", function () {
    textArea = document.getElementById("reference");
    parseButton = document.getElementById("parse-button");
    clearButton = document.getElementById("clear-button");
    preloadIcon = document.getElementById("parse-preload");
    parseButtonIcon = parseButton.querySelectorAll('.glyphicon')[0];
    resultContainer = document.getElementById("result-container");
    textArea.addEventListener("input", () => {
        updateButtonState();
    });
    clearButton.addEventListener("click", (e) => {
        e.preventDefault();
        running = false;
        textArea.value = '';
        resultContainer.innerHTML = '';
        updateButtonState();
    });
    parseButton.addEventListener("click", (e) => {
        e.preventDefault();
        running = true;
        updateButtonState();
        axios_1.default.post('/api/parsing', { reference: textArea.value })
            .then(function (response) {
            jobId = response.data;
            pollServer();
        })
            .catch(function (error) {
            // handle error
            console.log(error);
        });
        return false;
    });
    updateButtonState();
});
//# sourceMappingURL=index.js.map