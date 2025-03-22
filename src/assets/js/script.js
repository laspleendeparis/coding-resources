function main() {
  const items = getListItems();
  const searchBar = document.querySelector("#search-bar");
  searchBar.addEventListener("input", (e) => onSearch(e, items));
}

/**
 * @returns {NodeListOf<HTMLAnchorElement>[]} An array containing all link elements from the three sections
 */
function getListItems() {
  const resourceListItems = document.querySelectorAll("#resource-list>li>a");
  const generalProgrammingItems = document.querySelectorAll(
    "#general-programming>li>a"
  );
  const hardwareResourceListItems = document.querySelectorAll(
    "#hardware-resource-list>li>a"
  );
  console.log(resourceListItems);
  return [
    ...resourceListItems,
    ...generalProgrammingItems,
    ...hardwareResourceListItems,
  ];
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
