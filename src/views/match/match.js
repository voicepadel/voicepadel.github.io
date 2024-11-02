import { startSingalR } from '../../services/singalR.js';

let seconds = 0,
minutes = 0,
hours = 0;
let timerInterval; // Variable para almacenar el intervalo del temporizador
let isPaused = false; // Variable para controlar el estado del temporizador

const urlParams = new URLSearchParams(window.location.search);
const matchIdentifier = urlParams.get('matchIdentifier');
let currentGameGuid = "";
let useSignalR = true;

let connection = await startSingalR(matchIdentifier);

connection.on("GetNewState", (message) => {
  // Crear un nuevo elemento de mensaje
  console.log("new state:", message);
  setMatchPoints(message);
});

console.log('matchIdentifier: ' + matchIdentifier);

function onLoad() {
  getMatchCurrentState();
  startTimer();
}

function setMatchPoints(data) {
    document.getElementById("pointsTeamA").innerText = data.currentPointsTeamA.toString().padStart(2, '0');
    document.getElementById("pointsTeamB").innerText = data.currentPointsTeamB.toString().padStart(2, '0');
    document.getElementById("pointsTeamA").innerText = data.currentPointsTeamA.toString().padStart(2, '0');
    document.getElementById("pointsTeamB").innerText = data.currentPointsTeamB.toString().padStart(2, '0');

    document.getElementById("firstSetnumGamesTeamA").innerText = data.set1NumberOfGamesWonByTeamA ?? 0;
    document.getElementById("secondSetnumGamesTeamA").innerText = data.set2NumberOfGamesWonByTeamA ?? 0;
    document.getElementById("thirdSetnumGamesTeamA").innerText = data.set3NumberOfGamesWonByTeamA ?? 0;

    document.getElementById("firstSetnumGamesTeamB").innerText = data.set1NumberOfGamesWonByTeamB ?? 0;
    document.getElementById("secondSetnumGamesTeamB").innerText = data.set2NumberOfGamesWonByTeamB ?? 0;
    document.getElementById("thirdSetnumGamesTeamB").innerText = data.set3NumberOfGamesWonByTeamB ?? 0;

currentGameGuid = data.currentGameGuid;
}

function getMatchCurrentState() {
fetch(`https://voice-paddel-fmgzeugkg5bjh6f9.brazilsouth-01.azurewebsites.net/api/match/${matchIdentifier}/matchCurrentState`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error en la solicitud');
    }
    return response.json();
  })
  .then(data => {
    setMatchPoints(data);
    console.log('Respuesta del servidor:', data);
  })
  .catch(error => {
    console.error('Hubo un problema con la solicitud:', error);
  });
}

function startTimer() {
const timeElement = document.getElementById("time");

timerInterval = setInterval(() => {
  if (!isPaused) {
    // Solo actualizar si no está en pausa
    seconds++;
    if (seconds === 60) {
      seconds = 0;
      minutes++;
    }
    if (minutes === 60) {
      minutes = 0;
      hours++;
    }

    // Formato de tiempo HH:MM:SS
    const formattedTime =
      String(hours).padStart(2, "0") +
      ":" +
      String(minutes).padStart(2, "0") +
      ":" +
      String(seconds).padStart(2, "0");

    timeElement.textContent = formattedTime;
  }
}, 1000);
}

// Función para pausar el temporizador
function pauseTimer() {
isPaused = !isPaused; // Alternar el estado de pausa
const pauseButton = document.getElementById("pauseButton");
pauseButton.textContent = isPaused
  ? "Reanudar Partido"
  : "Pausar Partido"; // Cambiar texto del botón
}

// Iniciar el cronómetro al cargar la vista
onLoad();

// Agregar evento al botón de pausar
document
.getElementById("pauseButton")
.addEventListener("click", pauseTimer);

function countPoint(teamA){
  let message = {
    matchName: matchIdentifier,
    setGameConcurrencyVersion: currentGameGuid,
    pointTeamA: teamA
  };

  console.log('count point:', message);

  if (useSignalR) {
    connection.invoke("CountPoint", message).catch(err => console.error(err));
  }
  else {
    fetch(`https://voice-paddel-fmgzeugkg5bjh6f9.brazilsouth-01.azurewebsites.net/api/match/${matchIdentifier}/countPoint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          setGameConcurrencyVersion: currentGameGuid,
          pointTeamA: teamA
        })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la solicitud');
        }
        return response.json();
      })
      .then(data => {
        setMatchPoints(data);
      })
      .catch(error => {
        console.error('Hubo un problema con la solicitud:', error);
      });
  }
}

document
.getElementById("countPointTeamA")
.addEventListener("click", () => {
  countPoint(true)
});

document
.getElementById("countPointTeamB")
.addEventListener("click", () => {
  countPoint(false)
});

setTestRecognition();

function setTestRecognition(){
    const phrasesAzul = ['azul', 'punto']
    const phrasesRojo = ['rojo', 'punto']

    // Check for browser support
    if (!('webkitSpeechRecognition' in window)) {
        alert('Web Speech API is not supported by your browser.');
    } else {
        // Create a new instance of the webkitSpeechRecognition object
        const recognition = new webkitSpeechRecognition();

        // Set continuous to true
        recognition.continuous = true;
        recognition.interimResults = false;

        // Set language
        recognition.lang = 'es-AR';

        // Handle results
        recognition.onresult = function(event) {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            
            if(phrasesAzul.every(p => transcript.toLowerCase().includes(p))) {
                console.log('Punto reconocido azul')
                countPoint(false)
            }
            
            if(phrasesRojo.every(p => transcript.toLowerCase().includes(p))) {
                console.log('Punto reconocido rojo')
                countPoint(true)
            }
        };

        // Handle errors
        recognition.onerror = function(event) {
            console.error('Speech recognition error detected: ' + event.error);
        };

        recognition.onend = () => {
            console.log('Reconocimiento de voz detenido. Reiniciando...');
            recognition.start(); // Reinicia el reconocimiento si se detiene
        };

        // Start recognition
        recognition.start();
    }
}