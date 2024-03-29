import { API_BASE_URL, POLL_LIST_SIZE, ACCESS_TOKEN } from '../constants';

const request = (options) => {
  const headers = new Headers({
    'Content-Type': 'application/json',
  })

  if (localStorage.getItem(ACCESS_TOKEN)) {
    headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
  }

  const defaults = { headers: headers };
  options = Object.assign({}, defaults, options);

  return fetch(options.url, options)
    .then(response =>
      response.json().then(json => {
        if (!response.ok) {
          return Promise.reject(json);
        }
        return json;
      })
    );
};

export function getAllTasks(page, size) {
  page = page || 0;
  size = size || POLL_LIST_SIZE;

  return request({
    url: API_BASE_URL + "/tasks?page=" + page + "&size=" + size,
    method: 'GET'
  });
}

export function getTask(taskId) {
  return request({
    url: API_BASE_URL + "/tasks/" + taskId,
    method: 'GET'
  });
}

export function deleteTask(taskId) {
  return request({
    url: API_BASE_URL + "/tasks/" + taskId,
    method: 'DELETE'
  });
}

export function updateTask(taskData) {
  return request({
    url: API_BASE_URL + "/tasks/",
    method: 'PUT',
    body: JSON.stringify(taskData)
  });
}

export function createTask(taskData) {
  return request({
    url: API_BASE_URL + "/tasks",
    method: 'POST',
    body: JSON.stringify(taskData)
  });
}

export function login(loginRequest) {
  return request({
    url: API_BASE_URL + "/auth/signin",
    method: 'POST',
    body: JSON.stringify(loginRequest)
  });
}

export function signup(signupRequest) {
  return request({
    url: API_BASE_URL + "/auth/signup",
    method: 'POST',
    body: JSON.stringify(signupRequest)
  });
}

export function checkUsernameAvailability(username) {
  return request({
    url: API_BASE_URL + "/user/checkUsernameAvailability?username=" + username,
    method: 'GET'
  });
}

export function checkEmailAvailability(email) {
  return request({
    url: API_BASE_URL + "/user/checkEmailAvailability?email=" + email,
    method: 'GET'
  });
}


export function getCurrentUser() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/user/me",
    method: 'GET'
  });
}

export function getUserProfile(username) {
  return request({
    url: API_BASE_URL + "/users/" + username,
    method: 'GET'
  });
}

export function getUserCreatedTasks(username, page, size) {
  page = page || 0;
  size = size || POLL_LIST_SIZE;

  return request({
    url: API_BASE_URL + "/users/" + username + "/tasks?page=" + page + "&size=" + size,
    method: 'GET'
  });
}

export function getUserVotedTasks(username, page, size) {
  page = page || 0;
  size = size || POLL_LIST_SIZE;

  return request({
    url: API_BASE_URL + "/users/" + username + "/votes?page=" + page + "&size=" + size,
    method: 'GET'
  });
}
