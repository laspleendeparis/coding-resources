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
  const value = event.target.value.toLowerCase();

  for (const item of items) {
    const text = item.textContent.toLowerCase();
    const listItem = item.parentElement;
    text.includes(value)
      ? (listItem.style.display = "")
      : (listItem.style.display = "none");
  }
}

main();
