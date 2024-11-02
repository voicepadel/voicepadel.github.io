export function getAccessToken() {
    return localStorage.getItem('accessToken');
}

export function setAccessToken(token){
    localStorage.setItem('accessToken', token);
}

export function isLoggedIn() {
    return getAccessToken() !== null && getAccessToken() !== undefined;
}