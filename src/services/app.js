import { redirectTo } from './redirector.js';
import { isLoggedIn } from './auth.js';

document.getElementById('createLobby').addEventListener("click", function() {
    redirectTo("/src/views/lobby/lobby.html");
});

var myAccountElement = document.getElementById('myAccount');
console.log(isLoggedIn())
if (isLoggedIn()){
    myAccountElement.innerHTML = '<i class="bi bi-person"></i> Mi cuenta'
    myAccountElement.addEventListener("click", function() {
        redirectTo("/src/views/update/update.html");
    });
}
else {
    myAccountElement.innerHTML = '<i class="bi bi-person"></i> Registrarse'
    myAccountElement.addEventListener("click", function() {
        redirectTo("/src/views/register/register.html");
    });
}