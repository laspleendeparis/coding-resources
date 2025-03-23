import { getResourceLinks, getSearchBar } from "./element-fetchers.js";

export function setupSearch() {
  const links = getResourceLinks();
  const searchBar = getSearchBar();
  searchBar.addEventListener("input", (e) => onSearch(e, links));
}

/**
 * @param {Event} event - The event object from the search input
 * @param {NodeListOf<HTMLAnchorElement>[]} links - The collection of resource links to filter
 */
function onSearch(event, links) {
  const query = event.target.value.trim();
  if (!query) {
    showAll(links);
    return;
  }

  for (const link of links) {
    filterListItem(link, event.target.value);
  }
}

/**
 * @param {HTMLElement} link - The searchable link element to check
 * @param {string} query - The lowercase search query to filter by
 */
function filterListItem(link, query) {
  const linkText = link.textContent.toLowerCase();
  const linkTags = link?.dataset.tags?.split(",") || [];
  const listItem = link.parentElement;
  const { queryText, queryTags } = parseQuery(query.toLowerCase());

  if (queryText && linkText.includes(queryText)) {
    listItem.style.display = "";
    return;
  }

  for (const linkTag of linkTags) {
    for (const queryTag of queryTags) {
      if (linkTag.toLowerCase() === queryTag) {
        listItem.style.display = "";
        return;
      }
    }
  }

  listItem.style.display = "none";
}

/**
 * @param {string} query - The lowercase search query to filter by
 * @returns {{ queryText: string, queryTags: string[] }} The parsed search query
 */
function parseQuery(query) {
  const words = [];
  const queryTags = [];
  const parts = query.split(" ").filter((w) => w.trim() !== "");
  for (const part of parts) {
    if (part.startsWith("#")) {
      queryTags.push(part.slice(1).toLowerCase());
      continue;
    }
    words.push(part);
  }

  return {
    queryText: words.join(" "),
    queryTags,
  };
}

/**
 * @param {NodeListOf<HTMLAnchorElement>[]} links - The collection of resource links to filter
 */
function showAll(links) {
  for (const link of links) {
    link.parentElement.style.display = "";
  }
}
