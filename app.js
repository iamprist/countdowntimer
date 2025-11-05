// Timer variables
let totalSeconds = 0;
let remainingSeconds = 0;
let timerInterval = null;
let isRunning = false;
let is24HourFormat = true;
let currentMode = 'stopwatch'; // countdown, countup, stopwatch, clock

// DOM elements
const hoursInput = document.getElementById('hours');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const format24Btn = document.getElementById('format24');
const format12Btn = document.getElementById('format12');
const periodDisplay = document.getElementById('period');
const colorBtns = document.querySelectorAll('.color-btn');
const settingsBtn = document.getElementById('settingsBtn');
const settingsPanel = document.getElementById('settingsPanel');
const closeBtn = document.getElementById('closeBtn');
const modeBtns = document.querySelectorAll('.mode-btn');
const modeLabel = document.getElementById('modeLabel');
const timeInputGroup = document.getElementById('timeInputGroup');
const actionButtonsGroup = document.getElementById('actionButtonsGroup');
const fullscreenBtn = document.getElementById('fullscreenBtn');

// Flip card elements
const flipContainers = {
    hoursTens: document.getElementById('hours-tens'),
    hoursOnes: document.getElementById('hours-ones'),
    minutesTens: document.getElementById('minutes-tens'),
    minutesOnes: document.getElementById('minutes-ones'),
    secondsTens: document.getElementById('seconds-tens'),
    secondsOnes: document.getElementById('seconds-ones')
};

// Initialize timer display
function init() {
    updateDisplay(0, 0, 0);
}

// Format time conversion
function convertTo12Hour(hours) {
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return { hours: displayHours, period };
}

// Update flip card display
function updateFlipCard(container, value) {
    const topSpan = container.querySelector('.flip-card-top span');
    const bottomSpan = container.querySelector('.flip-card-bottom span');
    const flipSpan = container.querySelector('.flip-card-flip span');
    const currentValue = topSpan.textContent;

    if (currentValue !== value.toString()) {
        // Set flip card to show OLD number
        flipSpan.textContent = currentValue;
        
        // Start flipping animation - flip card will cover the top and flip down
        container.classList.add('flipping');
        
        // After flip completes, update BOTH top and bottom to NEW number
        setTimeout(() => {
            topSpan.textContent = value;
            bottomSpan.textContent = value;
            container.classList.remove('flipping');
        }, 1100); // 600ms flip + 500ms bounce
    }
}

// Update all display elements
function updateDisplay(hours, minutes, seconds) {
    let displayHours = hours;
    
    // Handle 12-hour format
    if (!is24HourFormat) {
        const converted = convertTo12Hour(hours);
        displayHours = converted.hours;
        periodDisplay.textContent = converted.period;
        periodDisplay.style.display = 'block';
    } else {
        periodDisplay.style.display = 'none';
    }

    // Split into digits
    const hoursTens = Math.floor(displayHours / 10);
    const hoursOnes = displayHours % 10;
    const minutesTens = Math.floor(minutes / 10);
    const minutesOnes = minutes % 10;
    const secondsTens = Math.floor(seconds / 10);
    const secondsOnes = seconds % 10;

    // Update flip cards
    updateFlipCard(flipContainers.hoursTens, hoursTens);
    updateFlipCard(flipContainers.hoursOnes, hoursOnes);
    updateFlipCard(flipContainers.minutesTens, minutesTens);
    updateFlipCard(flipContainers.minutesOnes, minutesOnes);
    updateFlipCard(flipContainers.secondsTens, secondsTens);
    updateFlipCard(flipContainers.secondsOnes, secondsOnes);
}

// Calculate time from seconds
function secondsToTime(totalSec) {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return { hours, minutes, seconds };
}

// Start timer
function startTimer() {
    if (!isRunning) {
        if (currentMode === 'clock') {
            alert('Clock mode runs automatically!');
            return;
        }

        if (currentMode === 'countdown' || currentMode === 'countup') {
            // Get input values
            const hours = parseInt(hoursInput.value) || 0;
            const minutes = parseInt(minutesInput.value) || 0;
            const seconds = parseInt(secondsInput.value) || 0;

            // Calculate total seconds
            totalSeconds = hours * 3600 + minutes * 60 + seconds;
            
            if (totalSeconds <= 0 && currentMode === 'countdown') {
                alert('Please set a valid time!');
                return;
            }

            if (currentMode === 'countdown') {
                remainingSeconds = totalSeconds;
            } else {
                remainingSeconds = 0; // Start from 0 for count up
            }
        } else if (currentMode === 'stopwatch') {
            remainingSeconds = remainingSeconds || 0; // Resume from where it was or start at 0
        }

        isRunning = true;

        // Update button states
        startBtn.disabled = true;
        pauseBtn.disabled = false;

        // Start timer based on mode
        timerInterval = setInterval(() => {
            if (currentMode === 'countdown') {
                if (remainingSeconds > 0) {
                    remainingSeconds--;
                    const time = secondsToTime(remainingSeconds);
                    updateDisplay(time.hours, time.minutes, time.seconds);
                } else {
                    // Timer finished
                    clearInterval(timerInterval);
                    isRunning = false;
                    startBtn.disabled = false;
                    pauseBtn.disabled = true;
                    playAlarm();
                }
            } else if (currentMode === 'countup') {
                if (remainingSeconds < totalSeconds) {
                    remainingSeconds++;
                    const time = secondsToTime(remainingSeconds);
                    updateDisplay(time.hours, time.minutes, time.seconds);
                } else {
                    // Count up finished
                    clearInterval(timerInterval);
                    isRunning = false;
                    startBtn.disabled = false;
                    pauseBtn.disabled = true;
                    playAlarm();
                }
            } else if (currentMode === 'stopwatch') {
                remainingSeconds++;
                const time = secondsToTime(remainingSeconds);
                updateDisplay(time.hours, time.minutes, time.seconds);
            }
        }, 1000);
    }
}

// Pause timer
function pauseTimer() {
    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        startBtn.textContent = 'Resume';
    }
}

// Reset timer
function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    remainingSeconds = 0;
    totalSeconds = 0;
    
    // Reset button states
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    startBtn.textContent = 'Start';

    // Reset display
    updateDisplay(0, 0, 0);
}

// Play alarm sound (visual feedback)
function playAlarm() {
    alert('Time\'s up! Take a break! 🎉');
    document.body.style.animation = 'pulse 0.5s ease-in-out 3';
    setTimeout(() => {
        document.body.style.animation = '';
    }, 1500);
}

// Toggle time format
function toggleTimeFormat(is24Hour) {
    is24HourFormat = is24Hour;
    
    if (is24Hour) {
        format24Btn.classList.add('active');
        format12Btn.classList.remove('active');
        hoursInput.max = 23;
    } else {
        format24Btn.classList.remove('active');
        format12Btn.classList.add('active');
        hoursInput.max = 12;
    }

    // Update display with current time
    const time = secondsToTime(remainingSeconds);
    updateDisplay(time.hours, time.minutes, time.seconds);
}

// Change background color
function changeBackgroundColor(color) {
    document.body.className = color;
    
    // Update active state
    colorBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.color === color) {
            btn.classList.add('active');
        }
    });
}

// Toggle fullscreen
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// Change mode
function changeMode(mode) {
    // Stop any running timer
    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
    }

    currentMode = mode;
    remainingSeconds = 0;
    totalSeconds = 0;

    // Update mode buttons
    modeBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.mode === mode) {
            btn.classList.add('active');
        }
    });

    // Update mode label
    modeLabel.textContent = mode.toUpperCase();

    // Show/hide controls based on mode
    if (mode === 'clock') {
        timeInputGroup.style.display = 'none';
        actionButtonsGroup.style.display = 'none';
        startClockMode();
    } else {
        timeInputGroup.style.display = mode === 'stopwatch' ? 'none' : 'block';
        actionButtonsGroup.style.display = 'block';
        
        // Reset button states
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        startBtn.textContent = 'Start';
        
        // Stop clock mode if it was running
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        
        // Reset display
        updateDisplay(0, 0, 0);
    }
}

// Start clock mode
function startClockMode() {
    function updateClock() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        
        updateDisplay(hours, minutes, seconds);
    }
    
    updateClock(); // Update immediately
    timerInterval = setInterval(updateClock, 1000);
}

// Toggle settings panel
function toggleSettings() {
    settingsPanel.classList.toggle('open');
}

// Close settings panel
function closeSettings() {
    settingsPanel.classList.remove('open');
}

// Event listeners
startBtn.addEventListener('click', () => {
    startTimer();
    closeSettings();
});
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
format24Btn.addEventListener('click', () => toggleTimeFormat(true));
format12Btn.addEventListener('click', () => toggleTimeFormat(false));
settingsBtn.addEventListener('click', toggleSettings);
closeBtn.addEventListener('click', closeSettings);
fullscreenBtn.addEventListener('click', toggleFullscreen);

// Mode selection
modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        changeMode(btn.dataset.mode);
    });
});

// Close settings when clicking outside
settingsPanel.addEventListener('click', (e) => {
    if (e.target === settingsPanel) {
        closeSettings();
    }
});

colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        changeBackgroundColor(btn.dataset.color);
    });
});

// Input validation
[hoursInput, minutesInput, secondsInput].forEach(input => {
    input.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        const max = parseInt(e.target.max);
        const min = parseInt(e.target.min);

        if (value > max) e.target.value = max;
        if (value < min) e.target.value = min;
    });
});

// Add pulse animation for alarm
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
    }
`;
document.head.appendChild(style);

// Keyboard controls - Spacebar to pause/resume
document.addEventListener('keydown', (e) => {
    // Check if spacebar is pressed and not in an input field
    if (e.code === 'Space' && !['INPUT', 'TEXTAREA', 'BUTTON'].includes(e.target.tagName)) {
        e.preventDefault(); // Prevent page scroll
        
        if (currentMode === 'clock') {
            return; // Don't allow pause in clock mode
        }
        
        if (isRunning) {
            pauseTimer();
        } else if (remainingSeconds > 0 || currentMode === 'stopwatch') {
            startTimer();
        }
    }
});

// Initialize on load
init();
changeMode('stopwatch');
