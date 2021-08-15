// Clock
const clockContainer = document.getElementById('clock-container');
const clockElTitle = document.getElementById('clock-title');
const clockTimeEls = document.querySelectorAll('.clock-time');


// Countdown
const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdownForm');
const dateEl = document.getElementById('date-picker');

const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownResetBtn = document.getElementById('countdown-reset-btn');
const countdownTimeEls = document.querySelectorAll('.countdown-time');

const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

/** Variables & Constants */
// Clock
let clockTitle = '';
let clockDate = '';
let clockValue = new Date();
let clockActive;
// Countdown
let countdownTitle = '';
let countdownDate = '';
let countdownValue = new Date();
let countdownActive;
let savedCountdown;

// View booleans
let isClock;
let isCountdown;

// Time variables
const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// Set Min Date
const today = new Date().toISOString().split("T")[0];
dateEl.setAttribute('min', today);

/** Functions */
// Populate countdown, complete UI
function updateDOM() {
    if (isCountdown) {
        countdownActive = setInterval(() => {
            const now =  new Date().getTime();
            const distance = countdownValue - now;
            // Calculate time units
            const days = Math.floor(distance / day);
            const hours = Math.floor((distance % day) / hour);
            const minutes = Math.floor((distance % hour) / minute);
            const seconds = Math.floor((distance % minute) / second);
    
            // Hide Input
            inputContainer.hidden = true;
    
            // If Countdown complete, show Complete
            if (distance < 0) {
                countdownEl.hidden = true;
                clearInterval(countdownActive);
                completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
                completeEl.hidden = false;
            }
            // Else, show Countdown 
            else {
                // Populate Countdown
                countdownElTitle.textContent = `${countdownTitle}`;
                countdownTimeEls[0].textContent = `${days}`;
                countdownTimeEls[1].textContent = `${hours}`;
                countdownTimeEls[2].textContent = `${minutes}`;
                countdownTimeEls[3].textContent = `${seconds}`;
                completeEl.hidden = true;
                countdownEl.hidden = false;
            }
        }, second);
    }

    if (isClock) {
        clockActive = setInterval(() => {
            const today = new Date();

            clockElTitle.textContent = `${Intl.DateTimeFormat().resolvedOptions().timeZone}`;
            clockTimeEls[0].textContent = `${today.getHours()}`;
            clockTimeEls[1].textContent = `${today.getMinutes()}`;
            clockTimeEls[2].textContent = `${today.getSeconds()}`;
        }, second);
    }
}


// Get values from Countdown Form
function updateCountdown(e) {
    e.preventDefault();
    // Set inputs
    countdownTitle = e.srcElement[0].value;
    countdownDate = e.srcElement[1].value;
    // Store in local storage
    savedCountdown = {
        title: countdownTitle,
        date: countdownDate,
    };
    localStorage.setItem('countdown', JSON.stringify(savedCountdown));

    // Check date input
    if (countdownDate === '') {
        alert('Please pick a date');
        return
    }
    // Get number version of current Date => updateDOM
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
}

// Reset Countdown
function resetCountdown() {
    // Hide countdown => show input
    countdownEl.hidden = true;
    completeEl.hidden = true;
    inputContainer.hidden = false;

    // Stop previous countdown
    clearInterval(countdownActive);

    // Reset variables
    countdownTitle = '';
    countdownDate = '';
    localStorage.removeItem('countdown');
}

// Get Local Storage Countdown
function restorePreviousCountdown() {
    // Get countdown from localStorage if available
    if (localStorage.getItem('countdown')) {
        inputContainer.hidden = true;
        savedCountdown = JSON.parse(localStorage.getItem('countdown'));
        countdownTitle = savedCountdown.title;
        countdownDate = savedCountdown.date;
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }
}

/** Event Listeners */
countdownForm.addEventListener('submit', updateCountdown);
countdownResetBtn.addEventListener('click', resetCountdown);
completeBtn.addEventListener('click', resetCountdown);


const countdownContainer = document.getElementById('countdown-container');

const countdownViewBtn = document.getElementById('countdown-btn');
countdownViewBtn.addEventListener('click', () => {
    isCountdown = true;
    isClock = false;

    isCountdown ? countdownContainer.hidden = false : '';
    isClock ? '' : clockContainer.hidden = true;

    if (localStorage.getItem('countdown')) {
        restorePreviousCountdown();
    }
    else {
        resetCountdown();
    }
});

const clockViewButton = document.getElementById('clock-btn');
clockViewButton.addEventListener('click', () => {
    isCountdown = false;
    isClock = true;
    
    isCountdown ? '' : countdownContainer.hidden = true ;
    isClock ? clockContainer.hidden = false : '';
    updateDOM();
});