const wordInput = document.querySelector("#word-input");
const currentWord = document.querySelector("#current-word");
const scoreDisplay = document.querySelector("#score");
const timeDisplay = document.querySelector("#time");
const messageDisplay = document.querySelector("#message");
const startBtn = document.querySelector("#start-btn");
const levelBtns = document.querySelectorAll('.level');
const levelOneBtn = document.getElementById("levelOne");
const levelTwoBtn = document.getElementById("levelTwo");
const levelThreeBtn = document.getElementById("levelThree");

const GAME_TIME = 6;

const API_URL = "https://random-word.ryanrk.com/api/en/word/random/100";

let score = 0;
let words = [];
let time = 0;
let timeInterval;
let isPlaying = false;
let isReady = false;
let btnTwoControl = false;
let btnThreeControl = false;


startBtn.addEventListener("click", e => {
  scoreDisplay.innerText = score;
  startBtn.disabled = true;

  countDown();
  setNewWord();
  btnControl();
  console.log(`btnTwo - ${btnTwoControl.toString()}`);
  console.log(`btnThree - ${btnThreeControl.toString()}`);
});


init()
async function init() {
  const res = await fetch(API_URL);
  const data = await res.json();

  if (btnTwoControl === true || btnThreeControl === true) {
    words = data.filter(item => item.length < 20 && item.length > 10);
    console.log("10 < letters < 20");
  } else words = data.filter(item => item.length < 10);

  isReady = true;
  startBtn.disabled = false;
}

levelOneBtn.addEventListener("click", e => {
  btnThreeControl = false;
  btnTwoControl = false;
  init()
});
levelTwoBtn.addEventListener("click", e => {
  btnThreeControl = false;
  btnTwoControl = true;
  init()
});
levelThreeBtn.addEventListener("click", e => {
  btnThreeControl = true;
  btnTwoControl = false;
  init()
});


async function levelThreeCondition(event) {
  const res = await fetch(API_URL);
  const data = await res.json();

  const target = event.target;
  const eventType = event.type;

  if (target.id === "levelThree" && eventType === "click") {
    //console.log(target.id);
    btnTwoControl = false;
    btnThreeControl = true;
    words = data.filter(item => item.length < 20 && item.length > 10);
    console.log(`btnTwo - ${btnTwoControl.toString()}`);
    console.log(`btnThree - ${btnThreeControl.toString()}`);
  }
}

/* function init(){ 
    const res = fetch(API_URL).then(res=> res.json()).then((data) => words = data);
} //promise문법 */


wordInput.addEventListener("input", (e) => {
  const typedText = e.target.value;
  const currentText = currentWord.innerText;

  if (typedText.toUpperCase() === currentText.toUpperCase() && isReady && isPlaying) {
    addScore();
    setNewWord();
  }
});

function gameover() {
  isPlaying = false;
  clearInterval(timeInterval);
  timeInterval = null;
  messageDisplay.innerText = "GAME OVER!";
  messageDisplay.style.color = "red";
  score = 0;
  startBtn.disabled = false;
  btnControl();
}

//time countdown
function countDown() {
  if (time > 0) {
    time = time - 1;
    timeDisplay.innerText = time;
  }
  if (time === 0 && isPlaying === true) {
    gameover();
  }
}

function setNewWord() {
  time = GAME_TIME;
  wordInput.value = "";
  messageDisplay.innerText = "Now Playing!!";
  messageDisplay.style.color = "white";
  const randomIndex = Math.floor(Math.random() * words.length);
  currentWord.innerText = words[randomIndex];

  if (isPlaying === false) {
    if(!btnThreeControl) {
      timeInterval = setInterval(countDown, 1000); 
    }else timeInterval = setInterval(countDown, 200); 
    isPlaying = true;
    startBtn.disabled = true;
  }
}

function addScore() {
  score = score + 1;
  scoreDisplay.innerText = score;
}

function btnControl() {
  if (!isPlaying) {
    levelOneBtn.disabled = false;
    levelTwoBtn.disabled = false;
    levelThreeBtn.disabled = false;
    return;
  } else {
    levelOneBtn.disabled = true;
    levelTwoBtn.disabled = true;
    levelThreeBtn.disabled = true;
    return;
  }
};