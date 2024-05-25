export const fetchAPI = async (endpoint, params = {}, dev = false) => {
  const API_HOST = import.meta.env.VITE_PROXY_HOST;
  // const API_HOST = "shazam.p.rapidapi.com";
  let url = new URL(`https://${API_HOST}${endpoint}`);

  for (let name in params) {
    url.searchParams.append(name, params[name]);
  }

  try {
    let response;
    if (dev) {
      response = await fetch(`/music_library/json/${endpoint}`);
    } else {
      response = await fetch(url.toString(), {
        headers: {
          'x-rapidapi-host': API_HOST,
          'x-rapidapi-key': import.meta.env.VITE_API_KEY,
        }
      });
    }
    const result = await response.json();
    if (!response.ok) throw new Error("Something went wrong. Try again later.");

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
  document.addEventListener('keydown', (e) => {
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

    qs(".custom-API-text").innerHTML = "You are using your own API Key. Requests are faster.";
    qs("#custom-API-KEY-btn").innerHTML = "Update API Key";

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
}

export const noImage = "/music_library/images/no-avatar.webp";

export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}