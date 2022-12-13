import axios, {AxiosResponse} from "axios";
import * as tf from "tableify";
import {run} from "node:test";

let running: boolean = false, jobId: string, textArea: HTMLInputElement | null,
    parseButton: HTMLButtonElement | null, parseButtonIcon: HTMLImageElement | null,
    preloadIcon: HTMLImageElement | null,
    clearButton: HTMLButtonElement | null,
    resultContainer = null;


const isEmpty = (): boolean => {
    return !!textArea.value.match(/^\s*$/);
}

const POLLING_DELAY = 1000

const pollServer = (): void => {
    if (!jobId) return;
    setTimeout(updateJobState, POLLING_DELAY)
};

const updateJobState = (): void => {
    if (!running) {
        return;
    }
    axios.get<AxiosResponse>(`/api/parsing/${jobId}`)
        .then(response => {
            jobId = response.data.toString();
            if (response.data) {
                let {id, ...parsing} = response.data['parsing'];
                resultContainer.innerHTML = tf(parsing);
                resultContainer.querySelectorAll("table")[0].classList.add("table", "table-striped")
                jobId = null;
                running = false;
                updateButtonState();
            }
            pollServer();
        })
        .catch(error => {
            // handle error
            console.log(error);
        })
}
const updateButtonState = (): void => {
    parseButton.disabled = isEmpty();
    clearButton.disabled = isEmpty();
    parseButtonIcon.style.visibility = running ? "hidden" : "visible";
    preloadIcon.style.visibility = running ? "visible" : "hidden";
};


document.addEventListener("DOMContentLoaded", function () {
    textArea = <HTMLInputElement>document.getElementById("reference");
    parseButton = <HTMLButtonElement>document.getElementById("parse-button");
    clearButton = <HTMLButtonElement>document.getElementById("clear-button");
    preloadIcon = <HTMLImageElement>document.getElementById("parse-preload");
    parseButtonIcon = <HTMLImageElement>parseButton.querySelectorAll('.glyphicon')[0];
    resultContainer = document.getElementById("result-container");
    textArea.addEventListener("input", () => {
        updateButtonState();
    })
    clearButton.addEventListener("click", (e) => {
        e.preventDefault();
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
                running = false;
            })
        return false;
    })
    updateButtonState();
});
