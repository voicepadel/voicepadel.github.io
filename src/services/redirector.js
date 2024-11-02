export function redirectTo(path) {
    const baseUrl = `${window.location.protocol}//${window.location.host}`;

    window.location.href = baseUrl + path;
}