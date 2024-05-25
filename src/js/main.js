import { qs, handleCustomAPIKey } from "./Utils";
import { renderDetails } from "./Details";
import { handleSearch } from "./Search";

document.addEventListener('DOMContentLoaded', async () => {
  // fetch("https://shazam-api-proxy.onrender.com/bbbbbb?term=dark")
  //   .then(res => res.json())
  //   .then(res => console.log(res))
  //   .catch(err => console.error('Error: ', err));

  if (qs("#search-form")) handleSearch();

  if (qs(".detail-page")) renderDetails();

  if (qs("#custom-API-KEY-btn")) handleCustomAPIKey();
});
