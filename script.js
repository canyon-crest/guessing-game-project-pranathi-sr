const myInput = document.getElementById("myInput");
const btnEnter = document.getElementById("btnEnter");
const guessBtn = document.getElementById("guessBtn");
const giveUp = document.getElementById("giveUp");
const playBtn = document.getElementById("playBtn");
const guess = document.getElementById("guess");
const dateElement = document.getElementById("date");
const msg = document.getElementById("msg");
const fastestTimeElement = document.getElementById("fastestTime");
const avgTimeElement = document.getElementById("avgTime");
const currentTimerElement = document.getElementById("currentTimer");
const wins = document.getElementById("wins");           
const avgScore = document.getElementById("avgScore");
// global variables
let level, answer, score;
const levelArr = document.getElementsByName("level");
const scoreArr = [];
let gameStartTime;
let fastestTime = Infinity;
let totalTimePlayedMs = 0;
let totalGamesFinished = 0;
let currentTimerInterval;
dateElement.textContent = time();
for(let i = 0; i < levelArr.length; i++){
    levelArr[i].disabled = true;
}
playBtn.disabled = true;
giveUp.disabled = true;
// add eventListeners
playBtn.addEventListener("click", play);
guessBtn.addEventListener("click", makeGuess);
giveUp.addEventListener("click", withGiveUp);
btnEnter.addEventListener("click", function (){ //() => {}
    myFunc(myInput.value)
});

function myFunc(myName){
    if(myName.trim() == ""){
        msg.textContent = "INVALID NAME";
        return;
    }
    myInput.disabled = true;
    btnEnter.disabled = true;
    for(let i = 0; i < levelArr.length; i++){
        levelArr[i].disabled = false;
    }
    playBtn.disabled = false;
    msg.textContent = "Hello, " + myName.trim() + "! Choose a Level to start:";
}
function play(){
    score = 0;
    playBtn.disabled = true;
    guessBtn.disabled = false; 
    guess.disabled = false; 
    giveUp.disabled = false;
    gameStartTime = Date.now();
    clearInterval(currentTimerInterval);
    currentTimerInterval = setInterval(updateStopwatch, 100);
    for(let i = 0; i < levelArr.length; i++){
        if(levelArr[i].checked){
            level = levelArr[i].value;
        }
        levelArr[i].disabled = true;
    }
    msg.textContent = "Guess a number from 1 - " + level; 
    answer = Math.floor(Math.random()*level)+1;
    guess.placeholder = answer;
}
function makeGuess(){
    let userGuess = parseInt(guess.value);
    if(isNaN(userGuess) || userGuess < 1 || userGuess > level){
        msg.textContent = "Enter a VALID number from 1 - " + level;
        return;
    }
    score ++; 
    const difference = Math.abs(userGuess - answer);
    let feedback = "";
    const levelMax = parseInt(level);
    if (difference <= Math.floor(levelMax * 0.05)) {
        feedback = "SUPER HOT! You're extremely close!";
    } else if (difference <= Math.floor(levelMax * 0.15)) {
        feedback = "Getting warmer! You're close!";
    } else if (difference <= Math.floor(levelMax * 0.30)) {
        feedback = "Warm. You're headed in the right direction.";
    } else if (difference <= Math.floor(levelMax * 0.50)) {
        feedback = "Yikes, it's Cold. You're a bit far off.";
    } else {
        feedback = "Oof, it's freezing in here! Too cold! You're very far off!";
    }
    if(userGuess < answer){
        msg.textContent = `${feedback} Too low, try again.`; 
    }
    else if(userGuess > answer){
        msg.textContent = `${feedback} Too high, try again.`;
    }
    else{
        msg.textContent = "You got it, it took you " + score + " tries! Press play to play again.";
        updateScore();
        reset();
    }
}
function reset(){
    guessBtn.disabled = true;
    guess.disabled = true;
    giveUp.disabled = true;
    guess.value = "";
    guess.placeholder = "";
    playBtn.disabled = false;
    clearInterval(currentTimerInterval);
    currentTimerElement.textContent = "Time: 0.00 s";
    for(let i = 0; i < levelArr.length; i++){
        levelArr[i].disabled = false;
    }
}
function updateScore(){
    const levelMax = parseInt(level);
    const bestScore = Math.ceil(Math.log2(levelMax)); //log 2 is the ideal number of guesses
    let performance = "";
    let elapsedTimeMs = 0;
    let gameWasWon = (score !== (levelMax + 1));
    if (gameStartTime) {
        const endTime = Date.now();
        elapsedTimeMs = endTime - gameStartTime;
        if (score !== (levelMax + 1)) { 
                const elapsedTimeSeconds = (elapsedTimeMs / 1000).toFixed(2);
                totalTimePlayedMs += elapsedTimeMs;
                totalGamesFinished++;
                if (totalGamesFinished > 0) {
                const avgTimeMs = totalTimePlayedMs / totalGamesFinished;
                const avgTimeSeconds = (avgTimeMs / 1000).toFixed(2);
                avgTimeElement.textContent = "Average Time: " + avgTimeSeconds + " seconds";
            }
                if (elapsedTimeMs < fastestTime) {
                fastestTime = elapsedTimeMs;
                fastestTimeElement.textContent = "Fastest Time: " + elapsedTimeSeconds + " seconds! (New Record!)";
            } 
                else {
                fastestTimeElement.textContent = "Fastest Time: " + (fastestTime / 1000).toFixed(2) + " seconds";
            }
            msg.textContent += " (Time taken: " + elapsedTimeSeconds + " seconds)";
        } 
        else {
             fastestTimeElement.textContent = "Fastest Time: " + (fastestTime === Infinity ? 'N/A' : (fastestTime / 1000).toFixed(2) + " seconds");
             if (totalGamesFinished > 0) {
                 const avgTimeSeconds = (totalTimePlayedMs / totalGamesFinished / 1000).toFixed(2);
                 avgTimeElement.textContent = "Average Time: " + avgTimeSeconds + " seconds";
             }
        }
        gameStartTime = null;
    }
    scoreArr.push(score);
    scoreArr.sort((a,b)=>a-b);
    if (score === levelMax + 1) { 
        performance = "Game abandoned. Score recorded as max tries.";
    }
    else if (score <= bestScore + 1) { 
        performance = "OH MY GOODNESS! That was an amazing score!";
    } else if (score <= bestScore * 2) {
        performance = "Good job! You did pretty well.";
    } else if (score <= levelMax / 2) {
        performance = "Eh, it's okay. At least got there in the end.";
    } else {
        performance = "You took way too many tries! You need to do better next time.";
    }

    msg.textContent = msg.textContent + " How you did: " + performance;

    let lb = document.getElementsByName("leaderboard");
    wins.textContent = "Total wins: " + scoreArr.length; 
    
    let sum = 0;
    for(let i = 0; i < scoreArr.length; i++){
        sum += scoreArr[i];
        if(i < lb.length){
            lb[i].textContent = scoreArr[i];
        }
    }
    
    let avg = 0; 
    if (scoreArr.length > 0) {
        avg = sum / scoreArr.length;
        avgScore.textContent = myInput.value + "'s Average Score: " + avg.toFixed(2);
    } else {
        avgScore.textContent = myInput.value + "'s Average Score: N/A";
    }
}
function getDateSuffix(day) {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    }
function time(){
    let d = new Date();
    const day = d.getDate();
    const month = d.toLocaleString('default', {month: 'long'});
    const suffix = getDateSuffix(day);
    const weekday = d.toLocaleString('default', {weekday: 'long'});
    let hours = d.getHours();       
    const minutes = d.getMinutes();
    const seconds = d.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12; 
    hours = hours ? hours : 12;
    const displayHours = hours;    
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(seconds).padStart(2, '0');
    d = weekday + ", " + month + " " + day + suffix + ", " + d.getFullYear() + " - " + displayHours + ":" + paddedMinutes + ":" + paddedSeconds + " " + ampm;
    return d;
}
function withGiveUp(){
    score = Number(level) + 1; 
    msg.textContent = "You gave up, so ha - you lose! The number was " + answer + ". Your score was recorded as " + score + " (max tries). Press play to play again.";
    updateScore();
    reset();
}
function currentClock() {
    dateElement.textContent = time();
}
currentClock(); 
setInterval(currentClock, 1000); // I used the set interval to call the function every second
function updateStopwatch() {
    if (gameStartTime) {
        const elapsed = Date.now() - gameStartTime;
        const seconds = (elapsed / 1000).toFixed(2);
        currentTimerElement.textContent = "Time:" + seconds + "s";
    }
}