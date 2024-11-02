import { redirectTo } from "../../services/redirector.js";
import { setAccessToken } from "../../services/auth.js";

// validación personalizada de bootstrap
(function () {
  "use strict";

  const forms = document.querySelectorAll(".needs-validation");

  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      (event) => {
        const password = document.getElementById("inputPassword");
        const confirmPassword = document.getElementById("confirm-password");

        // comprobar si las contraseñas coinciden
        if (password.value !== confirmPassword.value) {
          confirmPassword.setCustomValidity("Las contraseñas no coinciden.");
        } else {
          confirmPassword.setCustomValidity("");
        }

        // verificar la validez del form
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });

  document.getElementById("registerForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("inputPassword").value;

    const formData = {
      username: username,
      email: email,
      password: password,
    };

    fetch(
      "https://voice-paddel-fmgzeugkg5bjh6f9.brazilsouth-01.azurewebsites.net/api/user/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setAccessToken(data.accessToken);
        redirectTo('/src/views/index.html')
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Hubo un error al registrar. Por favor, inténtelo de nuevo.");
      });
  });
})();
