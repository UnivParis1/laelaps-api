import axios, {AxiosResponse} from "axios";
import * as tf from "tableify";

let running = false, jobId = null, textArea, parseButton, parseButtonIcon, clearButton, preloadIcon,
    resultContainer = null;


const isEmpty = () => {
    return !!textArea.value.match(/^\s*$/);
}

const POLLING_DELAY = 1000

function pollServer() {
    if (!jobId) return;
    setTimeout(askForJobState, POLLING_DELAY)
}

const askForJobState = () => {
    axios.get<AxiosResponse>(`/api/parsing/${jobId}`, {params: {reference: textArea.value}})
        .then(function (response) {
            jobId = response.data;
            if (response.data) {
                resultContainer.innerHTML = tf(response.data['parsing']);
                resultContainer.querySelectorAll("table")[0].classList.add("table", "table-striped")
                jobId = null;
                running = false
                updateButtonState();
            }
            pollServer();
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
}
const updateButtonState = () => {
    parseButton.disabled = isEmpty();
    clearButton.disabled = isEmpty();
    parseButtonIcon.style.visibility = running ? "hidden" : "visible"
    preloadIcon.style.visibility = !running ? "hidden" : "visible"
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
    })
    clearButton.addEventListener("click", (e) => {
        e.preventDefault();
        running = false;
        textArea.value = '';
        resultContainer.innerHTML = '';
        updateButtonState();
    })
    parseButton.addEventListener("click", (e) => {
        e.preventDefault();
        running = true;
        updateButtonState();
        axios.post('/api/parsing', {reference: textArea.value})
            .then(function (response) {
                jobId = response.data;
                pollServer();
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
        return false;
    })
    updateButtonState();
});
