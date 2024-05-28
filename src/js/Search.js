import { fetchAPI, noImage, setClick } from "./Utils";

export const handleSearch = () => {
  const searchForm = document.querySelector("#search-form");
  if (!searchForm) return;

  searchForm.addEventListener("submit", searchSubmit);
  searchForm.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') searchSubmit(e);
  });

  async function searchSubmit(e) {
    e.preventDefault();

    const searchValue = searchForm.querySelector(".search-input").value;
    if (!searchValue) return;
    searchForm.classList.add("disabled");

    try {
      const list = document.querySelector(".search-result-list");
      if (!list) {
        console.log("Search result list is not found.");
        return;
      }
      list.hidden = false;
      list.innerHTML = "";
      const result = await fetchAPI("/search", { "term": searchValue });

      if (Object.entries(result).length === 0) {
        list.innerHTML = `<li class="search-no-result">No results found. Please try another search term.</li>`;
        return;
      } else {
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

      list.innerHTML += `
        <li
          class="search-item"
          >
          <a
            data-type="song"
            class="search-item-link"
            href="${`/music_library/detail.html?type=song&id=${track.key}`}"
            style="background-image: url('${track.images?.coverart ?? noImage}')"
            >
            ${track.title} - ${track.subtitle}
          </a>
        </li>
      `;
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

      list.innerHTML += `
        <li 
          class="search-item"
          >
          <a
            data-type="artist"
            class="search-item-link" 
            href="${`/music_library/detail.html?type=artist&id=${artist.adamid}`}"
            style="background-image: url('${artist.avatar ?? noImage}')"
            >
            ${artist.name}
          </a>
        </li>
      `;
    });
  }
}