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
        // celebration: run confetti if available (safe to call)
        try {
            if (typeof confettiJS === 'function') {
                // position source a bit below the top so pieces are visible
                confettiJS({ x: window.innerWidth / 2, y: window.innerHeight / 3 });
            }
        } catch (e) { /* ignore errors */ }
        // subtle page shake for impact, but respect prefers-reduced-motion
        try {
            if (!window.matchMedia || !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                if (typeof shake === 'function') {
                    shake(450, 8);
                }
            }
        } catch (e) { /* ignore */ }
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
    // reveal the answer visually and to screen readers
    try {
        if (typeof revealAnswerAnimation === 'function') {
            revealAnswerAnimation(answer);
        }
        // also make a short aria-live announcement if available
        if (!document.getElementById('gg_aria_live')) {
            const lr = document.createElement('div');
            lr.id = 'gg_aria_live';
            lr.setAttribute('aria-live','polite');
            lr.style.position = 'absolute'; lr.style.left = '-9999px';
            document.body.appendChild(lr);
        }
        document.getElementById('gg_aria_live').textContent = 'The number was ' + answer + '.';
    } catch (e) { /* ignore */ }
    // record this abandon in stats
    try { recordAbandon(); } catch(e) { /* ignore */ }
    updateScore();
    reset();
}

// Reveal animation helper: shows a transient badge announcing the answer
function revealAnswerAnimation(answer) {
  try {
    const badge = document.createElement('div');
    badge.textContent = 'Answer: ' + answer;
    badge.style.position = 'fixed';
    badge.style.left = '50%';
    badge.style.top = '18%';
    badge.style.transform = 'translateX(-50%) scale(0.9)';
    badge.style.background = 'rgba(255,255,255,0.98)';
    badge.style.padding = '12px 18px';
    badge.style.borderRadius = '10px';
    badge.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
    badge.style.zIndex = 12000;
    badge.style.fontFamily = 'system-ui, Arial, sans-serif';
    badge.style.fontWeight = '700';
    badge.style.transition = 'transform 360ms cubic-bezier(.2,.8,.2,1), opacity 360ms';
    document.body.appendChild(badge);
    requestAnimationFrame(() => { badge.style.transform = 'translateX(-50%) scale(1)'; badge.style.opacity = '1'; });
    setTimeout(() => { badge.style.transform = 'translateX(-50%) scale(1.06)'; }, 380);
    setTimeout(() => { badge.style.opacity = '0'; badge.style.transform = 'translateX(-50%) scale(0.9)'; }, 1600);
    setTimeout(()=> { try { badge.remove(); } catch(e){} }, 2000);
  } catch (e) { /* ignore errors */ }
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
        currentTimerElement.textContent = "Time: " + seconds + "s";
    }
}
// Confetti (append-only)
function confettiJS({x=window.innerWidth/2,y=window.innerHeight/2, count=60} = {}) {
  const canv = document.createElement('canvas');
  canv.width = innerWidth; canv.height = innerHeight;
  canv.style.position = 'fixed';
  canv.style.left = '0'; canv.style.top = '0';
  canv.style.pointerEvents = 'none';
  canv.style.zIndex = '9999';
  document.body.appendChild(canv);
  const ctx = canv.getContext('2d');
  const pieces = Array.from({length:count}, () => ({
    x, y,
    vx:(Math.random()-0.5)*8,
    vy:(Math.random()*-7)-2,
    r: Math.random()*8+4,
    c: ['#ffc107','#ff3b30','#34c759','#007aff'][Math.floor(Math.random()*4)]
  }));
  let t = 0;
  (function draw(){
    ctx.clearRect(0,0,canv.width,canv.height);
    for(const p of pieces){
      p.x += p.vx; p.y += p.vy; p.vy += 0.35;
      ctx.fillStyle = p.c;
      ctx.fillRect(p.x, p.y, p.r, p.r*1.4);
    }
    t++;
    if(t < 140) requestAnimationFrame(draw);
    else canv.remove();
  })();
}
function shake(duration = 400, magnitude = 6) {
  const el = document.documentElement;
  const start = Date.now();
  const orig = el.style.transform || '';
  (function frame(){
    const now = Date.now(); const elapsed = now - start;
    if (elapsed < duration) {
      const x = (Math.random() - 0.5) * magnitude;
      const y = (Math.random() - 0.5) * magnitude;
      el.style.transform = `translate(${x}px, ${y}px)`;
      requestAnimationFrame(frame);
    } else {
      el.style.transform = orig;
    }
  })();
}
function revealAnswerAnimation(answer) {
  // create a transient badge near the top or near input
  const badge = document.createElement('div');
  badge.textContent = 'Answer: ' + answer;
  badge.style.position = 'fixed';
  badge.style.left = '50%';
  badge.style.top = '18%';
  badge.style.transform = 'translateX(-50%) scale(0.8)';
  badge.style.background = 'rgba(255,255,255,0.95)';
  badge.style.padding = '12px 18px';
  badge.style.borderRadius = '10px';
  badge.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
  badge.style.zIndex = 12000;
  badge.style.fontFamily = 'system-ui, Arial, sans-serif';
  badge.style.fontWeight = '700';
  badge.style.transition = 'transform 360ms cubic-bezier(.2,.8,.2,1), opacity 360ms';
  document.body.appendChild(badge);
  // announce for screen readers
  if (!document.getElementById('gg_aria_live')) {
    const lr = document.createElement('div');
    lr.id = 'gg_aria_live';
    lr.setAttribute('aria-live','polite');
    lr.style.position = 'absolute';
    lr.style.left = '-9999px';
    document.body.appendChild(lr);
  }
  document.getElementById('gg_aria_live').textContent = 'The number was ' + answer;
  // animate in, pulse, then remove
  requestAnimationFrame(() => { badge.style.transform = 'translateX(-50%) scale(1)'; });
  setTimeout(() => { badge.style.transform = 'translateX(-50%) scale(1.06)'; }, 380);
  setTimeout(() => { badge.style.opacity = '0'; badge.style.transform = 'translateX(-50%) scale(0.88)'; }, 1600);
  setTimeout(()=> badge.remove(), 2000);
}
function recordAbandon(){
  try{
    const KEY = 'gg_stats_v1';
    const s = JSON.parse(localStorage.getItem(KEY) || '{}');
    s.abandons = (s.abandons || 0) + 1;
    s.total = (s.total || 0) + 1;
    localStorage.setItem(KEY, JSON.stringify(s));
    // display small stat somewhere; quick toast:
    consolationToast('Games abandoned: ' + s.abandons + ' (you can retry!)');
  }catch(e){}
}
function consolationToast(msgText) {
  // create container if missing
  if (!document.getElementById('gg_toast_container')) {
    const c = document.createElement('div');
    c.id = 'gg_toast_container';
    c.style.position = 'fixed';
    c.style.left = '50%';
    c.style.bottom = '14%';
    c.style.transform = 'translateX(-50%)';
    c.style.zIndex = 12000;
    document.body.appendChild(c);
  }
  const el = document.createElement('div');
  el.textContent = '💪 ' + msgText;
  el.style.background = 'rgba(0,0,0,0.85)';
  el.style.color = '#fff';
  el.style.padding = '10px 14px';
  el.style.borderRadius = '999px';
  el.style.fontFamily = 'system-ui,Arial';
  el.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
  el.style.opacity = '0'; el.style.transition = 'opacity 220ms, transform 220ms';
  document.getElementById('gg_toast_container').appendChild(el);
  requestAnimationFrame(()=>{ el.style.opacity='1'; el.style.transform='translateY(-6px)'; });
  setTimeout(()=>{ el.style.opacity='0'; el.style.transform='translateY(0)'; setTimeout(()=>el.remove(),240); }, 2800);
  // light emoji burst (few elements)
  for (let i=0;i<8;i++){
    const e = document.createElement('div');
    e.textContent = ['✨','🌟','🎈','🙂'][Math.floor(Math.random()*4)];
    e.style.position='fixed';
    e.style.left = (window.innerWidth/2 + (Math.random()-0.5)*160) + 'px';
    e.style.top = (window.innerHeight*0.65 + (Math.random()-0.5)*40) + 'px';
    e.style.fontSize = (12 + Math.random()*18) + 'px';
    e.style.zIndex = 12000;
    e.style.pointerEvents = 'none';
    e.style.transition = 'transform 1000ms ease-out, opacity 1000ms';
    document.body.appendChild(e);
    requestAnimationFrame(()=> {
      e.style.transform = `translate(${(Math.random()-0.5)*140}px, ${-120 - Math.random()*120}px) rotate(${(Math.random()-0.5)*360}deg)`;
      e.style.opacity = '0';
    });
    setTimeout(()=> e.remove(), 1100);
  }
  // gentle vibrate
  if (navigator.vibrate) navigator.vibrate(100);
}
function showLevelPreview(levelValue){
  const id = 'gg_level_preview';
  let node = document.getElementById(id);
  if (node) node.remove();
  node = document.createElement('div');
  node.id = id;
  node.style.position = 'fixed';
  node.style.right = '12px';
  node.style.top = '12px';
  node.style.background = 'rgba(255,255,255,0.98)';
  node.style.padding = '10px 12px';
  node.style.borderRadius = '8px';
  node.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
  node.style.zIndex = 9999;
  const ideal = Math.ceil(Math.log2(Number(levelValue)));
  node.innerHTML = `<strong>Level: ${levelValue}</strong><div>Range: 1 - ${levelValue}</div><div>Ideal guesses: ${ideal}</div>`;
  document.body.appendChild(node);
  setTimeout(()=> node && node.remove(), 3000);
}

// Small label pulse animation when a level is selected
function animateLevelBadge(radioEl){
    try{
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const label = document.querySelector(`label[for="${radioEl.id}"]`);
        if (!label) return;
        const prevTransition = label.style.transition || '';
        const prevTransform = label.style.transform || '';
        label.style.transition = 'transform 220ms cubic-bezier(.2,.8,.2,1)';
        label.style.transform = 'scale(1.08)';
        setTimeout(() => {
            label.style.transform = prevTransform;
            setTimeout(()=> { label.style.transition = prevTransition; }, 240);
        }, 240);
    } catch(e) { /* ignore */ }
}

// Wire level radio buttons to show a preview and animate the selected label
function wireLevelSelectHandlers(){
    try{
        const radios = document.getElementsByName('level');
        if (!radios || radios.length === 0) return;
        const onChange = (ev) => {
            const r = ev.target;
            try { animateLevelBadge(r); } catch(e){}
            try { showLevelPreview(r.value); } catch(e){}
        };
        for (const r of radios) r.addEventListener('change', onChange);

        // Fallback: if a site variant doesn't fire change events or uses clickable labels,
        // attach click handlers to labels so preview still appears on the published site.
        const labels = document.querySelectorAll('label[for]');
        labels.forEach(label => {
            try{
                if (label.dataset.ggHooked) return;
                const fid = label.getAttribute('for');
                const radio = document.getElementById(fid);
                if (!radio) return;
                label.addEventListener('click', (ev) => {
                    // sometimes clicking the label toggles the radio; run preview after a tiny delay
                    setTimeout(() => {
                        try { animateLevelBadge(radio); } catch(e){}
                        try { showLevelPreview(radio.value); } catch(e){}
                    }, 10);
                });
                label.dataset.ggHooked = '1';
            }catch(e){}
        });
    } catch(e) { /* ignore */ }
}

document.addEventListener('DOMContentLoaded', wireLevelSelectHandlers);