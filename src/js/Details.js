import { fetchAPI, getParams, noImage, qs, setClick } from "./Utils"

export const renderDetails = async () => {
  const type = getParams("type");
  const id = getParams("id");

  if (!type || !id) window.location.href = "/";

  if (type === "song") renderSongDetails(id);
  else if (type === "artist") renderArtistDetails(id);
}

const renderSongDetails = async (id) => {
  try {
    const result = await fetchAPI("/shazam-songs/get-details", { "id": id });
    const hasErrors = checkFetchResult(result);
    if (hasErrors) return;

    const songData = result.resources["shazam-songs"];
    let key = Object.keys(songData)[0];
    const data = songData[key].attributes;
    const artistId = songData[key].relationships.artists.data[0].id;
    const lyrics = getLyrics(result.resources);
    const albumData = result.resources.albums;
    key = Object.keys(albumData)[0];
    const album = albumData[key].attributes;

    qs("main").innerHTML = `
      <div class="detail-description">
        <div class="detail-column">
          <div class="sticky-element">
            <img class="detail-image" src="${data.images.coverArt ?? noImage}" alt="Music library item detail image." />
            <audio controls>
              <source src="${data.streaming.preview}" type="audio/mp4">
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>
        <div class="detail-column">
          <div><span class="bold">Title:</span> ${data.title}</div>
          <div><span class="bold">Artist:</span> ${data.artist}</div>
          <div>
            <a href="${`/music_library/detail.html?type=artist&id=${artistId}`}" class="to-artist-link">To Artist Page</a>
          </div>
          <div><span class="bold">Album:</span> ${album.name} - ${album.releaseDate}</div>
          <div><span class="bold">Genre:</span> ${data.genres.primary}</div>
          <div><span class="bold">Label:</span> ${data.label}</div>
          <div><a href="${data.webUrl}" target="_blank">Shazam Link</a></div>
          ${lyrics}
        </div>
      </div>
    `;

    setClick("#open-lyrics", (e) => {
      qs(".lyrics-text").classList.add("active");
      e.target.setAttribute("hidden", true)
    });
  } catch (error) {
    console.error(error);
  }

  function getLyrics(resources) {
    if (!resources.lyrics) return "";

    const lyricsId = Object.keys(resources.lyrics)[0];
    const lyricsOj = resources.lyrics[lyricsId].attributes;
    const lyrics = `
    <div>
      <button id="open-lyrics">Song Lyrics</button>
      <div class="lyrics-text">
        <p>${lyricsOj.text.join("<br />")}</p>
        <p class="mt10">${lyricsOj.footer.replace(/\n/g, '<br />')}</p>
      </div>
    </div>
    `;

    return lyrics;
  }
}

const renderArtistDetails = async (id) => {
  try {
    const result = await fetchAPI("/artists/get-summary", { "id": id });
    const hasErrors = checkFetchResult(result);
    if (hasErrors) return;

    const artistData = result.resources.artists;
    const key = Object.keys(artistData)[0];
    const artist = artistData[key].attributes;

    const imageUrl = artist.artwork?.url?.replace(/{w}|{h}/g, '400');
    const albums = Object.values(result.resources.albums);
    const songs = Object.values(result.resources.songs);
    const albumList = renderAlbums(albums, songs);

    qs("main").innerHTML = `
      <div class="detail-description">
        <div class="detail-column">
          <div class="sticky-element">
            <div class="artist-name">${artist.name}</div>
            <img class="detail-image" src="${imageUrl ?? noImage}" alt="Music library item detail image." />
          </div>
        </div>
        <div class="detail-column">
          <div><span class="bold">Genres:</span> ${artist.genreNames.join(", ")}</div>
          <div><a class="artist-link apple-bg" href="${artist.url}" target="_blank">Artist on Apple Music</a></div>
          <div><span class="bold">Total albums:</span> ${albums.length}</div>
          ${albumList}
        </div>
      </div>
    `;
  } catch (error) {
    console.error(error);
  }

  function renderAlbums(albums, songs) {
    if (albums.length === 0) return "";

    const songsByAlbum = {};
    songs.map(item => {
      const song = item.attributes;
      const albumName = song.albumName;
      if (!songsByAlbum[albumName]) songsByAlbum[albumName] = [];
      songsByAlbum[albumName].push(song);
    });

    // sorting DESC
    albums.sort((a, b) => new Date(b.attributes.releaseDate) - new Date(a.attributes.releaseDate));

    const html = `
    <div>
      <p><span class="bold">Album List:</span></p>
      <ul class="album-list">
        ${albums.map(item => {
      const album = item.attributes;
      const albumImg = album.artwork.url.replace(/{w}|{h}/g, '50');
      const releaseDate = (new Date(album.releaseDate)).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      const songs = songsByAlbum[album.name] || [];

      return `
        <li class="album-item-li" style="background-image: url('${albumImg}')">
          <p class="album-name">
            <span class="bold">${album.name} - ${releaseDate}</span>
          </p>
          <a class="album-link apple-bg" href="${album.url}" target="_blank">Album on Apple Music</a>
          ${songs.map(song => {
        return `
          <p 
            class="album-song-item"
            >
            <a href="${`/music_library/detail.html?type=song&id=${song.playParams.id}`}">
              ${song.name}
            </a>
            <audio controls>
              <source src="${song.previews[0].url}" type="audio/mp4">
              Your browser does not support the audio element.
            </audio>
          </p>
            `;
      }).join("")}
        </li>
          `;
    }).join("")}
      </ul>
    </div>
    `;

    return html;
  }
}

function checkFetchResult(result) {
  let message = "";
  let hasErrors = true;

  if (Object.entries(result).length === 0) {
    message = `
    <p class="details-no-result">
      No results found. Please try another id or type.
    </p>`;
  } else if (result.resultText) {
    message = `
    <p class="details-no-result">
      Something went wrong. Here is the answer from the Server: 
      <span class="bold">${result.resultText}</span>
    </p>`;
  } else if (result.notOk) {
    message = `
    <p class="details-no-result">${result.notOk}</p>`;
  } else {
    hasErrors = false;
  }

  if (hasErrors) {
    message += `<a class="go-home-btn" href="/music_library/">To Home Page</a>`;
    qs("main").innerHTML = message;
  }

  return hasErrors;
}