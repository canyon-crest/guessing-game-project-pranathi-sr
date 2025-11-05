const myInput = document.getElementById("myInput");
const btnEnter = document.getElementById("btnEnter");
const guessBtn = document.getElementById("guessBtn");
const giveUp = document.getElementById("giveUp");
const playBtn = document.getElementById("playBtn");
const guess = document.getElementById("guess");
const dateElement = document.getElementById("date");
const msg = document.getElementById("msg");
// global variables
let level, answer, score;
const levelArr = document.getElementsByName("level");
const scoreArr = [];
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
    score = 0; // sets score to 0 every new game
    playBtn.disabled = true;
    guessBtn.disabled = false; 
    guess.disabled = false; 
    giveUp.disabled = false;
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
    score ++; //valid guess add 1 to score
    const difference = Math.abs(userGuess - answer);
    let feedback = "";
    const levelMax = parseInt(level);
    if (difference <= Math.floor(levelMax * 0.05)) { // within 5% of max range
        feedback = "SUPER HOT! You're extremely close!";
    } else if (difference <= Math.floor(levelMax * 0.15)) { // within 15% of max range
        feedback = "Getting warmer! You're close!";
    } else if (difference <= Math.floor(levelMax * 0.30)) { // within 30% of max range
        feedback = "Warm. You're headed in the right direction.";
    } else if (difference <= Math.floor(levelMax * 0.50)) { // within 50% of max range
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
        // Win condition remains the same
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
    for(let i = 0; i < levelArr.length; i++){
        levelArr[i].disabled = false;
    }
}
function updateScore(){
    scoreArr.push(score);
    scoreArr.sort((a,b)=>a-b);
    const levelMax = parseInt(level);
    const bestScore = Math.ceil(Math.log2(levelMax)); // log2(n) is the ideal number of guesses
    let performance = "";
    if (score <= bestScore + 1) { 
        performance = "OH MY GOODNESS! That was an amazing score!";
    } else if (score <= bestScore * 2) {
        performance = "Good job! You did pretty well.";
    } else if (score <= levelMax / 2) {
        performance = "Eh, it's okay. At least got there in the end.";
    } else {
        performance = "You took way too many tries! You need to do better next time.";
    }
        if (score === levelMax + 1) {
        performance = "Game abandoned. Score recorded as max tries.";
    }
    msg.textContent = msg.textContent + " How you did: " + performance;

    let lb = document.getElementsByName("leaderboard");
    wins.textContent = "Total wins: " + scoreArr.length;
    let sum = 0;
    for(let i = 0; i < scoreArr.length; i++){
        sum += scoreArr[i];
        if(i<lb.length){
            lb[i].textContent = scoreArr[i];
        }
    }
    let avg = sum/scoreArr.length;
    avgScore.textContent = myInput.value + "'s Average Score: " + avg.toFixed(2);
}
function getDateSuffix(day) {
        if (day > 3 && day < 21) return 'th'; // Handles 11th, 12th, 13th
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
    const hours = d.getHours();       
    const minutes = d.getMinutes();
    const seconds = d.getSeconds();
    const paddedHours = String(hours).padStart(2, '0');
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(seconds).padStart(2, '0');
    d = month + " " + day + suffix + ", " + d.getFullYear() + " - " + paddedHours + ":" + paddedMinutes + ":" + paddedSeconds;
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