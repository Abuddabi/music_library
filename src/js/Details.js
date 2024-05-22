import { fetchAPI, getParams, qs } from "./Utils"

export const renderDetails = async () => {
  const type = getParams("type");
  const id = getParams("id");

  if (!type || !id) window.location.href = "/";

  if (type === "song") renderSongDetails();


}

const renderSongDetails = async () => {
  try {
    // const result = await fetchAPI("/shazam-songs/get-details", { "id": id });
    // const result = await fetchAPI("SHAZAM-SONG-DETAILS.json", {}, true);
    const result = {};
    console.log(result);

    const main = qs("main");
    main.innerHTML = "";

    if (Object.entries(result).length === 0) {
      main.innerHTML = `
        <p class="details-no-result">
          No results found. Please try another id or type.
        </p>
        <a class="go-home-btn" href="/">To Home Page</a>`;
      return;
    } else {
      //success
    }
  } catch (error) {
    console.error(error);
  }
}