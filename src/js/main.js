import { qs, handleCustomAPIKey } from "./Utils";
import { renderDetails } from "./Details";
import { handleSearch, showSavedSearchResult } from "./Search";

export const environment = window.location.hostname === "localhost" ? "development" : "production";

document.addEventListener('DOMContentLoaded', async () => {
  if (qs(".search-result-list")) showSavedSearchResult();

  if (qs("#search-form")) handleSearch();

  if (qs(".detail-page")) renderDetails();

  if (qs("#custom-API-KEY-btn")) handleCustomAPIKey();
});
