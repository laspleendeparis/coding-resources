function main() {
  const items = getListItems();
  const searchBar = document.querySelector("#search-bar");
  searchBar.addEventListener("input", (e) => onSearch(e, items));
}

/**
 * @returns {NodeListOf<HTMLAnchorElement>[]} An array containing all link elements from the three sections
 */
function getListItems() {
  return document.querySelectorAll("[data-searchable]");
}

/**
 * @param {Event} event - The event object from the search input
 * @param {NodeListOf<HTMLAnchorElement>[]} items - The collection of resource items to filter
 */
function onSearch(event, items) {
  const query = event.target.value.toLowerCase();

  for (const item of items) {
    filterListItem(item, query);
  }
}

function filterListItem(item, query) {
  const text = item.textContent.toLowerCase();
  const tags = item?.dataset.tags?.split(",") || [];
  const contents = [text, ...tags];
  const listItem = item.parentElement;
  let i;
  for (i = 0; i < contents.length; i++) {
    if (contents[i].includes(query)) {
      listItem.style.display = "";
      break;
    }
  }
  if (i === contents.length) {
    listItem.style.display = "none";
  }
}
main();
