/* =========================
   MINI GAMES - SHORT VERSION
========================= */

let coins = Number(localStorage.getItem("riddleCoins")) || 0;
let soundOn = true;
let musicOn = true;
let currentGame = null;
let timer = null;

const $ = id => document.getElementById(id);

const games = [
  ["number","🔢","Number Guess","Guess the hidden number","Puzzle"],
  ["math","➗","Math Rush","Solve the calculation","Math"],
  ["rps","✊","Rock Paper Scissors","Beat the computer","Classic"],
  ["even","⚖️","Even or Odd","Choose the correct type","Math"],
  ["higher","📈","Higher or Lower","Guess higher or lower","Classic"],
  ["reaction","⚡","Reaction Test","Click as fast as possible","Action"],
  ["click","🖱️","Click Challenge","Click the target","Action"],
  ["memory","🧠","Memory Match","Remember the numbers","Memory"],
  ["sequence","🔢","Number Sequence","Find the next number","Puzzle"],
  ["scramble","🔤","Word Scramble","Unscramble the word","Word"],
  ["dice","🎲","Dice Battle","Roll the highest number","Classic"],
  ["coin","🪙","Coin Flip","Guess heads or tails","Classic"],
  ["target","🎯","Target Shooter","Hit the target","Action"],
  ["typing","⌨️","Typing Speed","Type the word quickly","Word"],
  ["quiz","❓","Quick Quiz","Answer the question","Quiz"],
  ["ttt","❌","Tic Tac Toe","Play against computer","Classic"],
  ["color","🎨","Color Tap","Tap the correct color","Puzzle"],
  ["count","🔢","Count Fast","Count the objects","Puzzle"],
  ["prime","🔵","Prime Checker","Check if number is prime","Math"],
  ["multiply","✖️","Multiplication","Solve multiplication","Math"],
  ["oddone","🔍","Odd One Out","Find the different item","Puzzle"],
  ["lights","💡","Lights Out","Turn off all lights","Puzzle"],
  ["mine","💣","Mine Finder","Find the safe box","Puzzle"],
  ["simon","🟢","Simon Memory","Remember the sequence","Memory"],
  ["hangman","📝","Hangman","Guess the word","Word"],
  ["anagram","🔀","Anagram","Make a word","Word"],
  ["length","📏","Word Length","Guess word length","Word"],
  ["capital","🏛️","Capital Quiz","Guess the capital","Quiz"],
  ["flag","🚩","Flag Quiz","Guess the country","Quiz"],
  ["animal","🐾","Animal Quiz","Guess the animal","Quiz"],
  ["emoji","😀","Emoji Guess","Guess the word","Quiz"],
  ["fast","⚡","Fast Click","Click 10 times","Action"],
  ["timing","⏱️","Perfect Timing","Stop at the right time","Action"],
  ["stopwatch","⏰","Stopwatch","Start and stop timer","Classic"],
  ["calculator","🧮","Quick Calculator","Solve the calculation","Math"],
  ["difference","🕵️","Find Difference","Find the different number","Puzzle"],
  ["sort","📊","Number Sort","Sort the numbers","Puzzle"],
  ["largest","⬆️","Find Largest","Find the largest number","Math"],
  ["smallest","⬇️","Find Smallest","Find the smallest number","Math"],
  ["fizz","💥","Fizz Buzz","Play Fizz Buzz","Math"],
  ["pattern","🧩","Pattern Puzzle","Complete the pattern","Puzzle"],
  ["symbol","🔣","Symbol Match","Find matching symbols","Memory"],
  ["shuffle","🥤","Cup Shuffle","Find the hidden ball","Classic"],
  ["wordguess","💬","Word Guess","Guess the word","Word"],
  ["reverse","🔄","Reverse It","Reverse the word","Word"],
  ["colorname","🌈","Color Name","Choose the color","Puzzle"],
  ["oddnumber","🔢","Odd Number","Find the odd number","Math"],
  ["balance","⚖️","Balance Math","Balance the equation","Math"],
  ["rocket","🚀","Rocket Launch","Launch the rocket","Action"],
  ["treasure","💎","Treasure Hunt","Find the treasure","Puzzle"]
];

function saveCoins(){
  localStorage.setItem("riddleCoins",coins);
  if($("gameCoins")) $("gameCoins").textContent=coins;
  if($("coinCount")) $("coinCount").textContent=coins;
}

function addCoins(n){
  coins+=n;
  saveCoins();
}

function beep(){
  if(!soundOn) return;
  try{
    const a=new AudioContext();
    const o=a.createOscillator();
    o.connect(a.destination);
    o.frequency.value=500;
    o.start();
    o.stop(a.currentTime+.08);
  }catch(e){}
}

function renderGames(){
  const box=$("gamesGrid");
  if(!box)return;

  const search=($("gameSearch")?.value||"").toLowerCase();
  const cat=$("gameCategory")?.value||"All";

  box.innerHTML=games
    .filter(g=>
      (cat==="All"||g[4]===cat)&&
      (g[2].toLowerCase().includes(search))
    )
    .map(g=>`
      <button class="game-card" onclick="openGame('${g[0]}')">
        <div class="game-logo">${g[1]}</div>
        <h3>${g[2]}</h3>
        <p>${g[3]}</p>
        <small>${g[4]}</small>
      </button>
    `).join("");

  if(!box.innerHTML)
    box.innerHTML="<p>No games found.</p>";
}

function openGame(id){
  location.hash=id;
  showGame(id);
}

function showGame(id){
  const g=games.find(x=>x[0]===id);
  if(!g)return;

  currentGame=id;

  $("gamesHome").hidden=true;
  $("gameScreen").hidden=false;
  $("gameTitle").textContent=`${g[1]} ${g[2]}`;
  $("gameDescription").textContent=g[3];

  clearInterval(timer);
  $("gameArea").innerHTML="";
  playGame(id);

  window.scrollTo(0,0);
}

function backToGames(){
  clearInterval(timer);
  location.hash="";
  currentGame=null;
  $("gameScreen").hidden=true;
  $("gamesHome").hidden=false;
  renderGames();
}

function restartGame(){
  if(currentGame) showGame(currentGame);
}

window.backToGames=backToGames;
window.restartGame=restartGame;

function inputGame(question,answer,win=10){
  $("gameArea").innerHTML=`
    <div class="game-box">
      <h3>${question}</h3>
      <input id="gameInput" class="game-input" autocomplete="off">
      <button class="primary-btn" onclick="
        if(document.getElementById('gameInput').value.toLowerCase().trim()==='${String(answer).toLowerCase()}'){
          document.getElementById('gameResult').textContent='🎉 Correct! +${win} coins';
          addCoins(${win}); beep();
        }else document.getElementById('gameResult').textContent='❌ Try again!';
      ">Submit</button>
      <p id="gameResult"></p>
    </div>`;
}

function random(a,b){
  return Math.floor(Math.random()*(b-a+1))+a;
}

/* =========================
   GAME ENGINE
========================= */

function playGame(id){

  if(id==="number"){
    const n=random(1,10);
    inputGame("Guess a number from 1 to 10",n);
  }

  else if(id==="math"){
    const a=random(2,20),b=random(2,20);
    inputGame(`${a} + ${b} = ?`,a+b);
  }

  else if(id==="rps"){
    $("gameArea").innerHTML=`
      <div class="game-box">
        <h3>Choose your move</h3>
        ${["Rock","Paper","Scissors"].map(x=>
          `<button class="game-choice" onclick="rps('${x}')">${x}</button>`
        ).join("")}
        <p id="gameResult"></p>
      </div>`;
  }

  else if(id==="even"){
    const n=random(1,100);
    inputGame(`Is ${n} even or odd?`,n%2?"odd":"even");
  }

  else if(id==="higher"){
    const a=random(1,50),b=random(1,50);
    inputGame(`Is ${b} higher or lower than ${a}?`,b>a?"higher":"lower");
  }

  else if(id==="reaction"){
    $("gameArea").innerHTML=`
      <div class="reaction-box" id="reactionBox">
        Wait...
      </div>`;
    setTimeout(()=>{
      $("reactionBox").textContent="CLICK!";
      $("reactionBox").onclick=()=>{
        addCoins(10);beep();
        $("reactionBox").textContent="🎉 Great reaction! +10";
      };
    },random(1500,4000));
  }

  else if(id==="click"){
    clickGame();
  }

  else if(id==="memory"){
    const nums=[1,2,3,4].sort(()=>Math.random()-.5);
    $("gameArea").innerHTML=`
      <div class="game-box">
        <h3>Remember these numbers:</h3>
        <h1 id="memoryText">${nums.join(" ")}</h1>
        <button class="primary-btn" onclick="
          memoryAsk('${nums.join("")}')
        ">Hide</button>
      </div>`;
  }

  else if(id==="sequence"){
    const a=random(1,10);
    inputGame(`${a}, ${a+2}, ${a+4}, ?`,a+6);
  }

  else if(id==="scramble"){
    const words=["apple","school","planet","computer","garden"];
    const w=words[random(0,words.length-1)];
    inputGame(w.split("").sort(()=>Math.random()-.5).join(""),w);
  }

  else if(id==="dice"){
    const a=random(1,6),b=random(1,6);
    inputGame(`You rolled ${a}. Roll again and enter your number. Need > ${a}`,">"+a);
  }

  else if(id==="coin"){
    $("gameArea").innerHTML=`
      <div class="game-box">
        <h3>Heads or Tails?</h3>
        <button class="game-choice" onclick="coinFlip('Heads')">🪙 Heads</button>
        <button class="game-choice" onclick="coinFlip('Tails')">🪙 Tails</button>
        <p id="gameResult"></p>
      </div>`;
  }

  else if(id==="target"){
    targetGame();
  }

  else if(id==="typing"){
    const w=["computer","javascript","challenge","keyboard"][random(0,3)];
    $("gameArea").innerHTML=`
      <div class="game-box">
        <h3>Type this:</h3>
        <h2>${w}</h2>
        <input id="gameInput" class="game-input">
        <button class="primary-btn" onclick="checkInput('${w}')">Submit</button>
        <p id="gameResult"></p>
      </div>`;
  }

  else if(id==="quiz"){
    const q=[
      ["What planet do we live on?","earth"],
      ["How many days are in a week?","7"],
      ["What is 5 + 5?","10"],
      ["What color is grass?","green"]
    ][random(0,3)];
    inputGame(q[0],q[1]);
  }

  else if(id==="ttt"){
    ticTacToe();
  }

  else if(id==="color"){
    const colors=["red","blue","green","yellow"];
    const c=colors[random(0,3)];
    $("gameArea").innerHTML=`
      <div class="game-box">
        <h3>Tap ${c}</h3>
        ${colors.map(x=>`
          <button class="color-btn" style="background:${x}"
          onclick="colorAnswer('${x}','${c}')">${x}</button>
        `).join("")}
        <p id="gameResult"></p>
      </div>`;
  }

  else if(id==="count"){
    const n=random(3,8);
    $("gameArea").innerHTML=`
      <div class="game-box">
        <h3>How many ⭐?</h3>
        <h1>${"⭐".repeat(n)}</h1>
        <input id="gameInput" class="game-input">
        <button class="primary-btn" onclick="checkInput('${n}')">Answer</button>
        <p id="gameResult"></p>
      </div>`;
  }

  else if(id==="prime"){
    const n=[7,9,11,12,13,15][random(0,5)];
    inputGame(`Is ${n} prime?`,[7,11,13].includes(n)?"yes":"no");
  }

  else if(id==="multiply"){
    const a=random(2,12),b=random(2,12);
    inputGame(`${a} × ${b} = ?`,a*b);
  }

  else if(id==="oddone"){
    const nums=[2,4,6,8,11];
    inputGame(`Which number is different? ${nums.join(" ")}`,11);
  }

  else if(id==="lights"){
    const n=random(1,9);
    inputGame(`Turn off ${n} light${n>1?"s":""}. Enter ${n}`,n);
  }

  else if(id==="mine"){
    const safe=random(1,4);
    $("gameArea").innerHTML=`
      <div class="game-box">
        <h3>Find the safe box!</h3>
        ${[1,2,3,4].map(n=>
          `<button class="game-choice" onclick="minePick(${n},${safe})">📦 ${n}</button>`
        ).join("")}
        <p id="gameResult"></p>
      </div>`;
  }

  else if(id==="simon"){
    const seq=[1,2,3].sort(()=>Math.random()-.5);
    inputGame(`Remember: ${seq.join("-")}`,seq.join("-"));
  }

  else if(id==="hangman"){
    const w=["cat","dog","tree","book"][random(0,3)];
    inputGame(`Guess the word. Hint: ${w.length} letters`,w);
  }

  else if(id==="anagram"){
    const w="planet";
    inputGame(`Make a word from: ${w.split("").sort(()=>Math.random()-.5).join("")}`,w);
  }

  else if(id==="length"){
    const w=["apple","computer","cat"][random(0,2)];
    inputGame(`How many letters in "${w}"?`,w.length);
  }

  else if(id==="capital"){
    const q=[
      ["India","delhi"],["Japan","tokyo"],
      ["France","paris"],["Italy","rome"]
    ][random(0,3)];
    inputGame(`Capital of ${q[0]}?`,q[1]);
  }

  else if(id==="flag"){
    inputGame("Which country has a maple leaf on its flag?","canada");
  }

  else if(id==="animal"){
    inputGame("Which animal says 'meow'?","cat");
  }

  else if(id==="emoji"){
    inputGame("🐶 = ?","dog");
  }

  else if(id==="fast"){
    clickGame(10);
  }

  else if(id==="timing"){
    $("gameArea").innerHTML=`
      <div class="game-box">
        <h3>Wait 3 seconds, then click!</h3>
        <button class="primary-btn" onclick="timingGame()">START</button>
        <p id="gameResult"></p>
      </div>`;
  }

  else if(id==="stopwatch"){
    stopwatchGame();
  }

  else if(id==="calculator"){
    const a=random(10,50),b=random(1,10);
    inputGame(`${a} - ${b} = ?`,a-b);
  }

  else if(id==="difference"){
    const n=random(1,9);
    inputGame(`Find the different number: ${n} ${n} ${n} ${n+1}`,n+1);
  }

  else if(id==="sort"){
    const a=[1,2,3,4,5].sort(()=>Math.random()-.5);
    inputGame(`Sort ascending: ${a.join(",")}`, "12345");
  }

  else if(id==="largest"){
    const a=[random(1,30),random(31,60),random(1,30)];
    inputGame(`Largest: ${a.join(", ")}`,Math.max(...a));
  }

  else if(id==="smallest"){
    const a=[random(1,30),random(31,60),random(1,30)];
    inputGame(`Smallest: ${a.join(", ")}`,Math.min(...a));
  }

  else if(id==="fizz"){
    inputGame("What comes after 1, 2, Fizz, 4?","buzz");
  }

  else if(id==="pattern"){
    inputGame("Complete: 2, 4, 6, ?",8);
  }

  else if(id==="symbol"){
    inputGame("Which symbol matches ★? Enter ★","★");
  }

  else if(id==="shuffle"){
    const safe=random(1,3);
    $("gameArea").innerHTML=`
      <div class="game-box">
        <h3>Find the hidden ball!</h3>
        ${[1,2,3].map(n=>
          `<button class="game-choice" onclick="shufflePick(${n},${safe})">🥤 ${n}</button>`
        ).join("")}
        <p id="gameResult"></p>
      </div>`;
  }

  else if(id==="wordguess"){
    inputGame("Guess a 3-letter animal","cat");
  }

  else if(id==="reverse"){
    inputGame("Reverse: hello","olleh");
  }

  else if(id==="colorname"){
    inputGame("What color is the sky?","blue");
  }

  else if(id==="oddnumber"){
    inputGame("Which is odd: 2, 4, 7, 8?","7");
  }

  else if(id==="balance"){
    inputGame("5 + ? = 10",5);
  }

  else if(id==="rocket"){
    rocketGame();
  }

  else if(id==="treasure"){
    treasureGame();
  }
}

/* =========================
   EXTRA GAME FUNCTIONS
========================= */

function checkInput(answer){
  const v=$("gameInput").value.trim().toLowerCase();
  if(v===String(answer).toLowerCase()){
    $("gameResult").textContent="🎉 Correct! +10 coins";
    addCoins(10); beep();
  }else $("gameResult").textContent="❌ Wrong! Try again.";
}

function rps(player){
  const moves=["Rock","Paper","Scissors"];
  const cpu=moves[random(0,2)];
  let win=player===cpu?"Draw":(
    (player==="Rock"&&cpu==="Scissors")||
    (player==="Paper"&&cpu==="Rock")||
    (player==="Scissors"&&cpu==="Paper")?"You win!":"You lose!"
  );
  if(win==="You win!"){addCoins(10);beep();}
  $("gameResult").textContent=`You: ${player} | CPU: ${cpu} | ${win}`;
}

function coinFlip(choice){
  const result=Math.random()<.5?"Heads":"Tails";
  if(choice===result){addCoins(10);beep();}
  $("gameResult").textContent=`${result}! ${choice===result?"🎉 You win!":"❌ Try again!"}`;
}

function memoryAsk(answer){
  $("memoryText").textContent="? ? ? ?";
  $("gameArea").innerHTML+=`
    <input id="gameInput" class="game-input" placeholder="Enter sequence">
    <button class="primary-btn" onclick="checkInput('${answer}')">Check</button>
    <p id="gameResult"></p>`;
}

function clickGame(goal=5){
  let n=0;
  $("gameArea").innerHTML=`
    <div class="game-box">
      <h3>Click ${goal} times!</h3>
      <button class="primary-btn" id="clickBtn">CLICK</button>
      <p id="gameResult">0 / ${goal}</p>
    </div>`;
  $("clickBtn").onclick=()=>{
    n++;
    $("gameResult").textContent=`${n} / ${goal}`;
    if(n>=goal){
      addCoins(10);beep();
      $("gameResult").textContent="🎉 Complete! +10 coins";
      $("clickBtn").disabled=true;
    }
  };
}

function targetGame(){
  $("gameArea").innerHTML=`
    <div class="game-box">
      <h3>Hit the target!</h3>
      <button id="targetBtn" class="target">🎯</button>
      <p id="gameResult"></p>
    </div>`;
  $("targetBtn").onclick=()=>{
    addCoins(10);beep();
    $("gameResult").textContent="🎯 HIT! +10 coins";
    $("targetBtn").disabled=true;
  };
}

function colorAnswer(a,b){
  if(a===b){addCoins(10);beep();$("gameResult").textContent="🎨 Correct! +10 coins";}
  else $("gameResult").textContent="❌ Wrong!";
}

function minePick(a,b){
  if(a===b){addCoins(10);beep();$("gameResult").textContent="💎 Safe! +10 coins";}
  else $("gameResult").textContent="💣 Mine!";
}

function shufflePick(a,b){
  if(a===b){addCoins(10);beep();$("gameResult").textContent="💎 Found it! +10 coins";}
  else $("gameResult").textContent="❌ Empty cup!";
}

function timingGame(){
  $("gameResult").textContent="⏳ Wait...";
  setTimeout(()=>{
    $("gameResult").textContent="CLICK NOW!";
    $("gameResult").onclick=()=>{
      addCoins(10);beep();
      $("gameResult").textContent="🎉 Perfect! +10 coins";
    };
  },3000);
}

function stopwatchGame(){
  let start;
  $("gameArea").innerHTML=`
    <div class="game-box">
      <h2 id="clock">0.00</h2>
      <button class="primary-btn" onclick="startWatch()">START</button>
      <button class="primary-btn" onclick="stopWatch()">STOP</button>
      <p id="gameResult"></p>
    </div>`;
  window.startWatch=()=>{
    start=performance.now();
    timer=setInterval(()=>{
      $("clock").textContent=((performance.now()-start)/1000).toFixed(2);
    },50);
  };
  window.stopWatch=()=>{
    clearInterval(timer);
    addCoins(5);
    $("gameResult").textContent="⏱️ +5 coins";
  };
}

function ticTacToe(){
  let board=["","","","","","","","",""];
  $("gameArea").innerHTML=`
    <div class="game-box">
      <div class="ttt-board">
        ${board.map((_,i)=>`<button onclick="tttMove(${i})" id="c${i}"></button>`).join("")}
      </div>
      <p id="gameResult"></p>
    </div>`;
  window.tttMove=i=>{
    if(board[i])return;
    board[i]="X";
    $(`c${i}`).textContent="❌";
    const empty=board.map((x,j)=>x?null:j).filter(x=>x!==null);
    if(empty.length){
      const j=empty[random(0,empty.length-1)];
      board[j]="O";
      $(`c${j}`).textContent="⭕";
    }
    if(checkWin(board,"X")){
      addCoins(15);beep();
      $("gameResult").textContent="🎉 You win! +15 coins";
    }
  };
}

function checkWin(b,p){
  return [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ].some(x=>x.every(i=>b[i]===p));
}

function rocketGame(){
  $("gameArea").innerHTML=`
    <div class="game-box">
      <h2 id="rocket">🚀</h2>
      <button class="primary-btn" onclick="launchRocket()">LAUNCH!</button>
      <p id="gameResult"></p>
    </div>`;
}

function launchRocket(){
  $("rocket").textContent="🚀🔥🚀";
  addCoins(15);beep();
  $("gameResult").textContent="🚀 Blast off! +15 coins";
}

function treasureGame(){
  const win=random(1,6);
  $("gameArea").innerHTML=`
    <div class="game-box">
      <h3>Choose a treasure chest!</h3>
      ${[1,2,3,4,5,6].map(n=>
        `<button class="game-choice" onclick="treasurePick(${n},${win})">💎 ${n}</button>`
      ).join("")}
      <p id="gameResult"></p>
    </div>`;
}

function treasurePick(a,b){
  if(a===b){
    addCoins(20);beep();
    $("gameResult").textContent="💰 TREASURE FOUND! +20 coins";
  }else $("gameResult").textContent="❌ Empty!";
}

/* =========================
   SETTINGS
========================= */

function setupSettings(){
  $("soundToggle")?.addEventListener("click",()=>{
    soundOn=!soundOn;
    $("soundToggle").textContent=`🔊 Sound: ${soundOn?"ON":"OFF"}`;
  });

  $("musicToggle")?.addEventListener("click",()=>{
    musicOn=!musicOn;
    $("musicToggle").textContent=`🎵 Music: ${musicOn?"ON":"OFF"}`;
  });

  $("gameSearch")?.addEventListener("input",renderGames);
  $("gameCategory")?.addEventListener("change",renderGames);
}

/* =========================
   START
========================= */

function load(){
  saveCoins();
  setupSettings();
  renderGames();

  if(location.hash){
    showGame(location.hash.slice(1));
  }
}

window.addEventListener("hashchange",()=>{
  if(location.hash) showGame(location.hash.slice(1));
  else backToGames();
});

load();