import { fetchAPI, getParams, noImage, qs, setClick } from "./Utils"

export const renderDetails = async () => {
  const type = getParams("type");
  const id = getParams("id");

  if (!type || !id) window.location.href = "/";

  if (type === "song") renderSongDetails(id);


}

const renderSongDetails = async (id) => {
  try {
    const result = await fetchAPI("/shazam-songs/get-details", { "id": id });
    // const result = await fetchAPI("SHAZAM-SONG-DETAILS.json", {}, true);
    const songData = result.resources["shazam-songs"];
    const key = Object.keys(songData)[0];
    const data = songData[key].attributes;
    const lyrics = getLyrics(result.resources);

    const main = qs("main");
    main.innerHTML = "";

    if (Object.entries(result).length === 0) {
      main.innerHTML = `
        <p class="details-no-result">
          No results found. Please try another id or type.
        </p>
        <a class="go-home-btn" href="/music_library/">To Home Page</a>`;
      return;
    } else {
      main.innerHTML = `
        <div class="detail-description">
          <img class="detail-image" src="${data.images.coverArt ?? noImage}" alt="Music library item detail image." />
          <audio controls>
            <source src="${data.streaming.preview}" type="audio/mp4">
            Your browser does not support the audio element.
          </audio>
          <div><span class="bold">Title:</span> ${data.title}</div>
          <div><span class="bold">Artist:</span> ${data.artist}</div>
          <div><span class="bold">Genre:</span> ${data.genres.primary}</div>
          <div><span class="bold">Label:</span> ${data.label}</div>
          <div>
            <button id="open-lyrics">Song Lyrics</button>
            <div class="lyrics-text">
              ${lyrics}
            </div>
          </div>
        </div>
      `;

      setClick("#open-lyrics", (e) => {
        qs(".lyrics-text").classList.add("active");
        e.target.setAttribute("hidden", true)
      });
    }
  } catch (error) {
    console.error(error);
  }

  function getLyrics(resources) {
    const lyricsId = Object.keys(resources.lyrics)[0];
    const lyricsOj = resources.lyrics[lyricsId].attributes;
    const lyrics = `
      <p>${lyricsOj.text.join("<br />")}</p>
      <p class="mt10">${lyricsOj.footer}</p>`;

    return lyrics;
  }
}