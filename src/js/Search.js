import { fetchAPI, getLocalStorage, noImage, qs, setClick, setLocalStorage } from "./Utils";

const searchLSKey = "search-history";

export const handleSearch = () => {
  const searchForm = qs("#search-form");
  if (!searchForm) return;

  searchForm.addEventListener("submit", searchSubmit);
  searchForm.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') searchSubmit(e);
  });

  async function searchSubmit(e) {
    e.preventDefault();

    const input = searchForm.querySelector(".search-input");
    const searchValue = input.value;
    if (!searchValue || searchForm.classList.contains("disabled")) return;
    searchForm.classList.add("disabled");

    try {
      const list = qs(".search-result-list");
      if (!list) {
        console.log("Search result list is not found.");
        return;
      }

      input.blur();
      const result = await fetchAPI("/search", { "term": searchValue });
      list.hidden = false;
      list.innerHTML = "";

      if (Object.entries(result).length === 0) {
        list.innerHTML = `<li class="search-no-result">No results found. Please try another search term.</li>`;
        return;
      } else {
        saveSearch(result);
        showSearchResult(result, list);
      }
    } catch (error) {
      console.error(error);
    } finally {
      searchForm.classList.remove("disabled");
    }
  }
}

const showSearchResult = (result, list) => {
  if (result.tracks) {
    list.innerHTML += `
      <li class="search-block-title">
        <h2>Songs</h2>
      </li>
    `;

    result.tracks.hits.forEach(item => {
      const track = item.track;

      list.innerHTML += htmlForSearchItem("song", {
        url: `/music_library/detail.html?type=song&id=${track.key}`,
        imgUrl: track.images?.coverart ?? noImage,
        title: `${track.title} - ${track.subtitle}`
      });
    });
  }

  if (result.artists) {
    list.innerHTML += `
      <li class="search-block-title">
        <h2>Artists</h2>
      </li>
    `;

    result.artists.hits.forEach(item => {
      const artist = item.artist;

      list.innerHTML += htmlForSearchItem("artist", {
        url: `/music_library/detail.html?type=artist&id=${artist.adamid}`,
        imgUrl: artist.avatar ?? noImage,
        title: artist.name
      });
    });
  }
}

function saveSearch(result) {
  const searchResult = getLocalStorage(searchLSKey) || { songs: [], artists: [] };
  const uniqueSongsIds = new Set(searchResult.songs.map(obj => obj.id));

  result.tracks.hits.map(item => {
    const track = item.track;
    const id = track.key;

    if (!uniqueSongsIds.has(id)) {
      searchResult.songs.push({
        id,
        url: `/music_library/detail.html?type=song&id=${track.key}`,
        imgUrl: track.images?.coverart ?? noImage,
        title: `${track.title} - ${track.subtitle}`
      });
      uniqueSongsIds.add(id);
    }
  });

  const uniqueArtistsIds = new Set(searchResult.artists.map(obj => obj.id));
  result.artists.hits.map(item => {
    const artist = item.artist;
    const id = artist.adamid;

    if (!uniqueArtistsIds.has(id)) {
      searchResult.artists.push({
        id,
        url: `/music_library/detail.html?type=artist&id=${artist.adamid}`,
        imgUrl: artist.avatar ?? noImage,
        title: artist.name
      });
      uniqueArtistsIds.add(id);
    }
  });

  setLocalStorage(searchLSKey, searchResult);
}

export const showSavedSearchResult = () => {
  qs(".search-input").value = "";
  const searchResult = getLocalStorage(searchLSKey);
  if (!searchResult) return;

  const list = qs(".search-result-list");
  list.hidden = false;
  list.innerHTML = `
    <li class="saved-search-title">
      <h2>Your previous searches: </h2>
    </li>
  `;

  if (searchResult.songs) {
    list.innerHTML += `
      <li class="search-block-title">
        <h2>Songs</h2>
      </li>
    `;

    searchResult.songs.forEach(song => {
      list.innerHTML += htmlForSearchItem("song", song);
    });
  }

  if (searchResult.artists) {
    list.innerHTML += `
      <li class="search-block-title">
        <h2>Artists</h2>
      </li>
    `;

    searchResult.artists.forEach(artist => {
      list.innerHTML += htmlForSearchItem("artist", artist);
    });
  }
}

function htmlForSearchItem(type, searchItem) {
  return `
  <li 
    class="search-item"
    >
    <a
      data-type="${type}"
      class="search-item-link" 
      href="${searchItem.url}"
      style="background-image: url('${searchItem.imgUrl}')"
      >
      ${searchItem.title}
    </a>
  </li>
  `;
}