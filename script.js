if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service_worker_file.js')
            .then((reg) => console.log('Service Worker Registered!', reg))
            .catch((err) => console.log('Service Worker registration failed:', err));
    });
}
// 1. Core Game Variables
let currentLevel = 1;
let score = 0;
let correctAnswer;
let chosenOp = 'mixed';

// 2. Timer & Sound Variables (Fixed)
let timePerQuestion = 10; 
let timeLeft;
let timerInterval;
let isMuted = false;

// --- START GAME ---
function startGame() {
    // Get values from the Setup Screen
    currentLevel = parseInt(document.getElementById('level-select').value) || 1;
    chosenOp = document.getElementById('op-select').value;
    timePerQuestion = parseInt(document.getElementById('time-select').value) || 10;
    score = 0;
    
    // Switch Screens
    document.getElementById('setup-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    
    updateDisplay();
    nextProblem();
}

// --- GENERATE PROBLEM ---
function nextProblem() {
    const min = Math.pow(10, currentLevel - 1);
    const max = Math.pow(10, currentLevel) - 1;
    
    let n1 = Math.floor(Math.random() * (max - min + 1)) + min;
    let n2 = Math.floor(Math.random() * (max - min + 1)) + min;
    
    let op = chosenOp;
    if (op === 'mixed') {
        const ops = ['+', '-', '*', '/'];
        op = ops[Math.floor(Math.random() * ops.length)];
    }

    // Handle Division (No decimals)
    if (op === '/') {
        let product = n1 * n2;
        document.getElementById('problem-box').innerText = `${product} ÷ ${n1}`;
        correctAnswer = n2;
    } else {
        correctAnswer = eval(`${n1} ${op} ${n2}`);
        let displayOp = op === '*' ? '×' : op;
        document.getElementById('problem-box').innerText = `${n1} ${displayOp} ${n2}`;
    }

    // Reset UI for new question
    document.getElementById('answer-input').value = "";
    document.getElementById('answer-input').focus();
    document.getElementById('message').innerText = "";
    
    startTimer(); // Start the countdown
}

// --- CHECK ANSWER ---
function checkAnswer() {
    clearInterval(timerInterval); // Stop timer immediately

    const userVal = parseFloat(document.getElementById('answer-input').value);
    const msg = document.getElementById('message');

    if (userVal === correctAnswer) {
        if (!isMuted) document.getElementById('sound-correct').play();
        score += 10;
        msg.innerText = "Correct! 🌟";
        msg.style.color = "#10b981";
        
        if (score % 50 === 0) {
            currentLevel++;
            msg.innerText = "Level Up! Difficulty increased.";
        }
    } else {
        if (!isMuted) document.getElementById('sound-wrong').play();
        msg.innerText = `Incorrect. Answer was ${correctAnswer}`;
        msg.style.color = "#ef4444";
    }

    updateDisplay();
    setTimeout(nextProblem, 1200);
}

// --- TIMER LOGIC ---
function startTimer() {
    clearInterval(timerInterval);
    timeLeft = timePerQuestion;
    const progress = document.getElementById('timer-progress');
    
    timerInterval = setInterval(() => {
        timeLeft -= 0.1;
        progress.style.width = (timeLeft / timePerQuestion * 100) + "%";

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeout();
        }
    }, 100);
}

function handleTimeout() {
    if (!isMuted) document.getElementById('sound-wrong').play();
    const msg = document.getElementById('message');
    msg.innerText = `Time's Up! Answer: ${correctAnswer}`;
    msg.style.color = "#f59e0b";
    setTimeout(nextProblem, 1500);
}

// --- UTILITIES ---
function toggleMute() {
    isMuted = !isMuted;
    document.getElementById('mute-btn').innerText = isMuted ? "🔇" : "🔊";
}

function updateDisplay() {
    document.getElementById('level-display').innerText = currentLevel;
    document.getElementById('score-display').innerText = score;
}

function resetGame() {
    clearInterval(timerInterval);
    document.getElementById('setup-screen').style.display = 'block';
    document.getElementById('game-screen').style.display = 'none';
}

// Enter Key Support
document.getElementById('answer-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkAnswer();
});
