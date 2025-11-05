const myInput = document.getElementById("myInput");
const btnEnter = document.getElementById("btnEnter");
const guessBtn = document.getElementById("guessBtn");
const giveUp = document.getElementById("giveUp");
const playBtn = document.getElementById("playBtn");
const guess = document.getElementById("guess");
const myPara = document.getElementById("msg");
// global variables
let level, answer, score;
const levelArr = document.getElementsByName("level");
const scoreArr = [];
const dateElement = document.getElementById("date");
dateElement.textContent = time();
for(let i = 0; i < levelArr.length; i++){
    levelArr[i].disabled = true;
}
playBtn.disabled = true;
// add eventListeners
playBtn.addEventListener("click", play);
guessBtn.addEventListener("click", makeGuess);
btnEnter.addEventListener("click", function (){ //() => {}
    myFunc(myInput.value)
});

function myFunc(myName){
    if(myName.trim() == ""){
        myPara.textContent = "INVALID NAME";
        return;
    }
    myInput.disabled = true;
    btnEnter.disabled = true;
    for(let i = 0; i < levelArr.length; i++){
        levelArr[i].disabled = false;
    }
    playBtn.disabled = false;
    myPara.textContent = "Hello, " + myName.trim() + "! Choose a Level to start:";
}
function play(){
    score = 0; // sets score to 0 every new game
    playBtn.disabled = true;
    guessBtn.disabled = false; 
    guess.disabled = false; 
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
    if(userGuess < answer){
        msg.textContent = "Too low, try again.";
    }
    else if(userGuess > answer){
        msg.textContent = "Too high, try again.";
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
    guess.value = "";
    guess.placeholder = "";
    playBtn.disabled = false;
    for(let i = 0; i < levelArr.length; i++){
        levelArr[i].disabled = false;
    }
}
function updateScore(){
    scoreArr.push(score);
    scoreArr.sort((a,b)=>a-b); //sort increasing order
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
    const paddedMinutes = String(minutes).padStart(2, '0');   
    d = month + " " + day + suffix + ", " + d.getFullYear() + " - " + hours + ":" + paddedMinutes;
    return d;
}
