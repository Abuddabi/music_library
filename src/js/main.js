import "../css/style.css"
import { qs } from "./Utils";
import { renderDetails } from "./Details";
import { handleSearch } from "./Search";

document.addEventListener('DOMContentLoaded', () => {
  if (qs("#search-form")) handleSearch();

  if (qs(".detail-page")) renderDetails();
});
