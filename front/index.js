"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var tf = require("tableify");
var running = false, jobId, textArea, parseButton, parseButtonIcon, preloadIcon, clearButton, resultContainer = null;
var isEmpty = function () {
    return !!textArea.value.match(/^\s*$/);
};
var POLLING_DELAY = 1000;
var pollServer = function () {
    if (!jobId)
        return;
    setTimeout(updateJobState, POLLING_DELAY);
};
var updateJobState = function () {
    if (!running) {
        return;
    }
    axios_1.default.get("/api/parsing/".concat(jobId), { params: { reference: textArea.value } })
        .then(function (response) {
        jobId = response.data.toString();
        if (response.data) {
            var _a = response.data['parsing'], id = _a.id, parsing = __rest(_a, ["id"]);
            resultContainer.innerHTML = tf(parsing);
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
var updateButtonState = function () {
    parseButton.disabled = isEmpty();
    clearButton.disabled = isEmpty();
    parseButtonIcon.style.visibility = running ? "hidden" : "visible";
    preloadIcon.style.visibility = running ? "visible" : "hidden";
};
document.addEventListener("DOMContentLoaded", function () {
    textArea = document.getElementById("reference");
    parseButton = document.getElementById("parse-button");
    clearButton = document.getElementById("clear-button");
    preloadIcon = document.getElementById("parse-preload");
    parseButtonIcon = parseButton.querySelectorAll('.glyphicon')[0];
    resultContainer = document.getElementById("result-container");
    textArea.addEventListener("input", function () {
        updateButtonState();
    });
    clearButton.addEventListener("click", function (e) {
        e.preventDefault();
        textArea.value = '';
        resultContainer.innerHTML = '';
        updateButtonState();
    });
    parseButton.addEventListener("click", function (e) {
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
            running = false;
        });
        return false;
    });
    updateButtonState();
});
//# sourceMappingURL=index.js.map