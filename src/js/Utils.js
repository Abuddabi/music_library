export const fetchAPI = async (endpoint, params = {}, dev = false) => {
  const API_HOST = import.meta.env.VITE_API_HOST;
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