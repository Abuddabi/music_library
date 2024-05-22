import "../css/style.css"
import { handleSearch } from "./Search";

document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.querySelector("#search-form");
  if (searchForm) handleSearch();
});
