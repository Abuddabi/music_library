export const fetchAPI = async (endpoint, params = {}, dev = false) => {
  // const API_HOST = import.meta.env.VITE_API_HOST;
  const API_HOST = "shazam.p.rapidapi.com";
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
export function setClick(selector, callback) {
  if (typeof selector === "string") selector = qs(selector);

  selector.addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  selector.addEventListener("click", callback);
}

// get params from url
export function getParams(param) {
  // parse the params in url
  const urlParams = new URLSearchParams(window.location.search);
  // get and return the first param
  return urlParams.get(param);
}

export const noImage = "/music_library/images/no-avatar.webp";