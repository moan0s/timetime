const x = document.getElementById("myAudio");
const timelineList = document.querySelector('#timelineList');
const currentSectionDisplay = document.querySelector('#currentSection');
let secondsLeft;
function playAudio() {
  x.play();
}



function secondsToHms(d) {
  d = Number(d);

  var h = Math.floor(d / 3600);
  var m = Math.floor(d % 3600 / 60);
  var s = Math.floor(d % 3600 % 60);

  return ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
}


const sections = [
  {"name": "Arbeiten", "time": 55, "type": "work"},
  {"name": "Pause", "time": 5, "type": "relax"},
  {"name": "Arbeiten", "time": 25, "type": "work"},
  {"name": "Pause", "time": 5, "type": "relax"},
  {"name": "Arbeiten", "time": 25, "type": "work"},
  {"name": "Pause", "time": 5, "type": "relax"},
  {"name": "Arbeiten", "time": 25, "type": "work"},
  {"name": "Pause", "time": 5, "type": "relax"},
  {"name": "Arbeiten", "time": 25, "type": "work"},
  {"name": "Pause", "time": 5, "type": "relax"},
  {"name": "Arbeiten", "time": 25, "type": "work"},
  {"name": "Pause", "time": 5, "type": "relax"},
  {"name": "Arbeiten", "time": 25, "type": "work"},
  {"name": "Pause", "time": 5, "type": "relax"},
  {"name": "Arbeiten", "time": 25, "type": "work"},
];

function createTimeline() {
  for (let i = 0; i < sections.length; i++) {
    let sectionItem = document.createElement("li")
    let sectionContainer = document.createElement("div")
    sectionContainer.id = "sectionContainer" + i;
    sectionContainer.classList.add("sectionContainer");
    let sectionNumber = document.createElement("div")
    sectionNumber.innerText =  (i+1).toString();
    sectionNumber.onclick =  function() { resetTimerToSection(i); };
    sectionNumber.id = "sectionNumber" + i;
    sectionNumber.classList.add("section", "box");
    let sectionDesc = document.createElement("div")
    sectionDesc.innerHTML =  "<b>"+ sections[i]["name"] + "</b> " + sections[i]["time"] + "min";
    sectionDesc.onclick =  function() { resetTimerToSection(i); };
    sectionDesc.id = "sectionDesc" + i;
    sectionNumber.classList.add("sectionDescription", "box")
    timelineList.appendChild(sectionItem);
    sectionItem.appendChild(sectionContainer);
    sectionContainer.appendChild(sectionNumber);
    sectionContainer.appendChild(sectionDesc);
  }
}


var timeInSection = parseInt(window.localStorage.getItem("timePreviousInSection")) + 0;

function pauseTimer() {
  timeInSection = parseInt(window.localStorage.getItem("timePreviousInSection")) + (Date.now() - parseInt(window.localStorage.getItem("timeContinued")));
  window.localStorage.setItem("timePreviousInSection", timeInSection);
  window.localStorage.setItem("timePaused", Date.now());
}

function continueTimer() {
  window.localStorage.setItem("timeContinued", Date.now());
}

function resetTimerToSection(section) {
  window.localStorage.setItem("timePreviousInSection", 0);
  window.localStorage.setItem("currentSection", section);
  window.localStorage.setItem("timeContinued", Date.now());
}

function resetTimerFull() {
  window.localStorage.setItem("timePreviousInSection", 0);
  window.localStorage.setItem("currentSection", 0);
  window.localStorage.setItem("timePaused", Date.now());
  window.localStorage.setItem("timeContinued", Date.now());
}
function displayDate(i) {
  document.getElementById("demo").innerHTML = i;
}


function updateActiveSection() {
  let currentSection = parseInt(window.localStorage.getItem("currentSection"));
  for (let i = 0; i < sections.length; i++) {
    let sec = document.querySelector('#sectionNumber' + i);
    if (i == currentSection) {
      sec.classList.add("active")
    }
    else {
      sec.classList.remove("active")
    }
  }
}
window.onload = function () {
  createTimeline();
  setInterval(function () {
    let currentSection = parseInt(window.localStorage.getItem("currentSection"));
    let timePreviousInSection = parseInt(window.localStorage.getItem("timePreviousInSection"));
    let timeContinued = parseInt(window.localStorage.getItem("timeContinued"));
    let timePausedd = parseInt(window.localStorage.getItem("timePaused"));

    // if it is running calculate new time
    if (timeContinued > timePausedd){
      timeInSection =  timePreviousInSection + (Date.now()-timeContinued);
    }
    else {
      timeInSection =  timePreviousInSection;
    }
    if (timeInSection > sections[currentSection]["time"] * 60 * 1000) {
      currentSection += 1;
      window.localStorage.setItem("timeContinued", Date.now());
      window.localStorage.setItem("timePreviousInSection", 0);
      playAudio();
    }
    secondsLeft = sections[currentSection]["time"] * 60 - timeInSection/1000;

    updateActiveSection();
    window.localStorage.setItem("currentSection", currentSection.toString());

    document.getElementById("base-timer-label").innerHTML = formatTime(
      secondsLeft
    );
    setCircleDasharray();
    setRemainingPathColor(secondsLeft);

    }, 1000);

};

const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;

const COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};

let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

document.getElementById("app").innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
  secondsLeft
)}</span>
</div>
`;


function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = Math.floor(time % 60);

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

function setRemainingPathColor(secondsLeft) {
  const { alert, warning, info } = COLOR_CODES;
  if (secondsLeft <= alert.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(alert.color);
  } else if (secondsLeft <= warning.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(info.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(warning.color);
  }
  else {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color, alert.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(info.color);
  }
}

function calculateTimeFraction() {
  let timeLimit = sections[parseInt(window.localStorage.getItem("currentSection"))]["time"]*60;
  const rawTimeFraction = secondsLeft / timeLimit;
  return rawTimeFraction - (1 / timeLimit) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}


