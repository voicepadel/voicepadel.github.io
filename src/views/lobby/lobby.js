import { redirectTo } from "../../services/redirector.js";

// Script para manejar la selección del modo de juego
document
  .getElementById("gameModeSelect")
  .addEventListener("change", function () {
    const gameDescription = document.getElementById("gameDescription");
    const partidoCorto = document.getElementById("partido-corto");
    const partidoEstandar = document.getElementById("partido-estandar");

    // Ocultar todas las descripciones
    partidoCorto.style.display = "none";
    partidoEstandar.style.display = "none";

    // Mostrar la descripción adecuada según la opción seleccionada
    switch (this.value) {
      case "1":
        partidoCorto.style.display = "block";
        break;
      case "2":
        partidoEstandar.style.display = "block";
        break;
      default:
        break;
    }
  });

const params = new URLSearchParams(window.location.search);

const matchIdentifier = params.get("matchIdentifier");

document.getElementById("start-match").addEventListener("click", function () {
  // Obtener los valores de los campos de texto
  const firstPlayerTeamA = document.getElementById("firstPlayerTeamA").value;
  const secondPlayerTeamA = document.getElementById("secondPlayerTeamA").value;
  const firstPlayerTeamB = document.getElementById("firstPlayerTeamB").value;
  const secondPlayerTeamB = document.getElementById("secondPlayerTeamB").value;

  // Verificar si los campos están vacíos
  if (
    !firstPlayerTeamA &&
    !secondPlayerTeamA &&
    !firstPlayerTeamB &&
    !secondPlayerTeamB
  ) {
    // Activar validación de Bootstrap
    const firstField = document.getElementById("firstPlayerTeamA");
    firstField.classList.add("is-invalid");

    // Puedes mostrar un mensaje adicional si lo deseas
    return; // Detener la ejecución
  } else {
    // Limpiar la clase de error si ya hay un valor
    document.getElementById("firstPlayerTeamA").classList.remove("is-invalid");
  }

  // Armar el objeto para el body del fetch
  const data = {
    FirstPlayerNameTeamA: firstPlayerTeamA,
    SecondPlayerTeamA: secondPlayerTeamA,
    FirstPlayerTeamB: firstPlayerTeamB,
    SecondPlayerTeamB: secondPlayerTeamB,
  };

  // Hacer el fetch
  fetch(
    "https://voice-paddel-fmgzeugkg5bjh6f9.brazilsouth-01.azurewebsites.net/api/match/startQuickMatch",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error en la red");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Éxito:", data);
      redirectTo(
        "/src/views/match/match.html?matchIdentifier=" + data.matchIdentifier
      );
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

document.getElementById("closeLobby").addEventListener("click", function () {
  window.location.href = "../index.html";
});
