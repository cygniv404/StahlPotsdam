// Electron Inter Process Communication and dialog
const { ipcRenderer } = window.require('electron');
const isDev = window.require('electron-is-dev');
const baseUrl = isDev ? 'localhost:7777' : '104.248.131.211';
// Dynamically generated TCP (open) port between 3000-3999
// const port = ipcRenderer.sendSync('get-port-number');
const settings = ipcRenderer.sendSync('get-user-settings');
const userToken = settings.user.token;

/**
 * @namespace Requests
 * @description - Helper functions for network requests (e.g., get, post, put, delete, etc..)
 */

/**
 * @description - Helper GET method for sending requests to and from the Python/Flask services.
 * @param {string} route - Path of the Python/Flask service you want to use.
 * @param {Function} callback - Callback function which uses the returned data as an argument.
 * @param {Function} errorCallback - Callback function which uses the returned error as an argument.
 * @param {string | null} token
 * @return response data from Python/Flask service.
 * @memberof Requests
 */
export const get = (route, callback, errorCallback, token = null) => fetch(`http://${baseUrl}/${route}`, {
  method: 'GET',
  headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token ?? userToken}` },
})
  .then((response) => response.json())
  .then(callback)
  .catch((error) => (errorCallback ? errorCallback(error) : console.error(error)));

/**
 * @description - Helper POST method for sending requests to and from the Python/Flask services.
 * @param body - request body of data that you want to pass.
 * @param route - URL route of the Python/Flask service you want to use.
 * @param callback - optional callback function to be invoked if provided.
 * @param {Function} errorCallback - Callback function which uses the returned error as an argument.
 * @param token
 * @return response data from Python/Flask service.
 * @memberof Requests
 */
export const post = (
  body,
  route,
  callback,
  errorCallback,
  token = null,
) => fetch(`http://${baseUrl}/${route}`, {
  body: JSON.stringify(body),
  method: 'POST',
  headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token ?? userToken}` },
})
  .then((response) => response.json())
  .then(callback)
  .catch((error) => (errorCallback ? errorCallback(error) : console.error(error)));

/**
 * @description - Helper PUT method for sending requests to and from the Python/Flask services.
 * @param body - request body of data that you want to pass.
 * @param route - URL route of the Python/Flask service you want to use.
 * @param callback - optional callback function to be invoked if provided.
 * @param {Function} errorCallback - Callback function which uses the returned error as an argument.
 * @param {string | null} token
 * @return response data from Python/Flask service.
 * @memberof Requests
 */
export const put = (
  body,
  route,
  callback,
  errorCallback,
  token = null,
) => {
  fetch(`http://${baseUrl}/${route}`, {
    body: JSON.stringify(body),
    method: 'PUT',
    headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token ?? userToken}` },
  })
    .then((response) => response.json())
    .then(callback)
    .catch((error) => (errorCallback ? errorCallback(error) : console.error(error)));
};

/**
 * @description - Helper POST method for sending requests to and from the Python/Flask services.
 * @param body - request body of data that you want to pass.
 * @param route - URL route of the Python/Flask service you want to use.
 * @param callback - optional callback function to be invoked if provided.
 * @param {Function} errorCallback - Callback function which uses the returned error as an argument.
 * @param {string | null} token
 * @return response data from Python/Flask service.
 * @memberof Requests
 */
export const dlt = (
  body,
  route,
  callback,
  errorCallback,
  token = null,
) => {
  fetch(`http://${baseUrl}/${route}`, {
    body: JSON.stringify(body),
    method: 'DELETE',
    headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token ?? userToken}` },
  })
    .then((response) => response.json())
    .then(callback)
    .catch((error) => (errorCallback ? errorCallback(error) : console.error(error)));
};
