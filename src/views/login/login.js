import { setAccessToken } from '../../services/auth.js';
import { redirectTo } from '../../services/redirector.js'

document.getElementById("loginBtn").addEventListener("click", (event) => {
  event.preventDefault(); // Evita que la página se recargue

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Verificación simple de campos vacíos
  if (!username || !password) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  // Crear el objeto con los datos del formulario
  const loginData = {
    username: username,
    password: password,
  };

  // Enviar los datos al servidor usando fetch
  fetch(
    "https://voice-paddel-fmgzeugkg5bjh6f9.brazilsouth-01.azurewebsites.net/api/user/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Credenciales incorrectas");
      }
      return response.json();
    })
    .then((data) => {
      setAccessToken(data.accessToken);
      redirectTo('/src/views/index.html')
    })
    .catch((error) => {
      console.error("Error:", error);
      console.log(JSON.stringify(loginData));
      alert("Hubo un problema al iniciar sesión. Por favor, intenta de nuevo.");
    });
});
