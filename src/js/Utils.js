import { environment } from "./main";

export const fetchAPI = async (endpoint, params = {}) => {
  let url, options = {};

  if (environment === "development") {
    const jsonName = endpoint.replace(/\//g, "_");
    url = `/music_library/json/${jsonName}.json`;
  } else {
    const API_HOST = getAPIHost();
    url = new URL(`https://${API_HOST}${endpoint}`);
    for (let name in params) {
      url.searchParams.append(name, params[name]);
    }
    url = url.toString();
    options = getAPIOptions(API_HOST);
  }

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    if (!response.ok) {
      console.error(result);
      throw new Error("Something went wrong. Try again later.");
    }

    return result;
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
}

export const qs = (selector, parent = document) => parent.querySelector(selector);

// set a listener for both touchend and click
export function setClick(selector, callback, options = {}) {
  if (typeof selector === "string") selector = qs(selector);

  selector.addEventListener("touchend", (e) => {
    e.preventDefault();
    callback(e);
  }, options);
  selector.addEventListener("click", (e) => callback(e), options);
}

// get params from url
export function getParams(param) {
  // parse the params in url
  const urlParams = new URLSearchParams(window.location.search);
  // get and return the first param
  return urlParams.get(param);
}

export function handleCustomAPIKey() {
  const apiKey = getLocalStorage("custom-shazam-API");
  if (apiKey) ifUsingCustomAPI();

  const body = qs("body");
  const input = qs(".custom-API-input");

  setClick("#custom-API-KEY-btn", () => {
    body.classList.add("modal-active");
    input.focus();
  });
  setClick(".modal-overlay", (e) => {
    e.stopPropagation();
    body.classList.remove("modal-active");
  });
  setClick(".custom-API-input-confirm", confirm);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      confirm();
    }
  });

  function confirm() {
    const value = input.value;
    if (!value) return;

    setLocalStorage("custom-shazam-API", value);
    input.value = "";

    ifUsingCustomAPI();

    const newModal = document.createElement("div");
    newModal.classList.add("modal", "modal-thank-you");
    newModal.innerHTML = `<h3 class="modal-title">Thank You!</h3>`;
    qs("main").append(newModal);

    setClick(".modal-overlay", () => {
      qs(".modal").style.display = "none";
      setTimeout(() => {
        qs(".modal").style.display = "block";
        qs(".modal-thank-you").remove();
      }, 1000);
    }, { once: true });
  }

  function ifUsingCustomAPI() {
    qs(".custom-API-text").innerHTML = "You are using your own API Key. Requests are faster.";
    qs("#custom-API-KEY-btn").innerHTML = "Update API Key";
  }
}

export function getAPIHost() {
  const apiKey = getLocalStorage("custom-shazam-API");
  let host;

  if (!apiKey) host = "shazam-api-proxy.onrender.com"; // proxy
  else host = "shazam.p.rapidapi.com";

  return host;
}

function getAPIOptions(API_HOST) {
  const apiKey = getLocalStorage("custom-shazam-API");

  if (!apiKey) return {};
  else return {
    headers: {
      'x-rapidapi-host': API_HOST,
      'x-rapidapi-key': apiKey,
    }
  }
}

export const noImage = "/music_library/images/no-avatar.webp";

export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}