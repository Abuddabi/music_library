import { fetchAPI } from "./Utils";

export const handleSearch = () => {
  const searchForm = document.querySelector("#search-form");
  if (!searchForm) return;

  searchForm.addEventListener("submit", async (e) => {
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
      // const result = await fetchAPI("/search", { "term": searchValue });
      const result = await fetchAPI("SEARCH.json", {}, true);

      if (Object.entries(result).length === 0) {
        list.innerHTML = `<li class="search-no-result">No results found. Please try another search term.</li>`;
        return;
      } else {
        showSearchResult(result, list);
        handleSearchItemClick();
      }
    } catch (error) {
      console.error(error);
    } finally {
      searchForm.classList.remove("disabled");
    }
  });
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
          data-type="song"
          data-id="${track.key}"
          style="background-image: url('${track.images?.coverart ?? "/music_library/images/no-avatar.webp"}')">
          ${track.title} - ${track.subtitle}
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
          data-type="artist"
          data-id="${artist.id}"
          style="background-image: url('${artist.avatar ?? "/music_library/images/no-avatar.webp"}')">
          ${artist.name}
        </li>
      `;
    });
  }
}

const handleSearchItemClick = () => {
  const items = document.querySelectorAll(".search-item");

  items.forEach(li => {
    li.addEventListener("click", () => {
      const type = li.dataset.type;
      const id = li.dataset.id;

      window.location.href = `/music_library/detail-page.html?type=${type}&id=${id}`;
    });
  });
}