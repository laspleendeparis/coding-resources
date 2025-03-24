import {
  getResourceLinks,
  getSearchBox,
  getSearchBar,
} from "./element-fetchers.js";

/**
 * @typedef {Object} TagsManager
 * @property {HTMLElement|undefined} tagButton - The button element for individual tags
 * @property {HTMLElement|undefined} tagsContainer - The container for all tag buttons
 * @property {HTMLElement|undefined} tagsSection - The container for all tag elements
 * @property {HTMLElement|undefined} toggleButton - The button to toggle tag visibility
 * @property {boolean} collapsed - Whether the tags section is currently collapsed
 * @property {Function} createTagSection - Creates and returns the tags UI section
 */

/** @type {TagsManager} */
const tagsManager = {
  tagButton: undefined,
  tagsContainer: undefined,
  tagsSection: undefined,
  toggleButton: undefined,
  collapsed: true,

  /**
   * @param {Object} sortedTags - Object with tag names as keys and occurrence counts as values
   * @returns {HTMLElement} The container element with all tag components
   */
  createTagSection(sortedTags) {
    this.tagsSection = document.createElement("div");
    this.tagsSection.classList.add("tags-section");

    this._setupTagsContainer(sortedTags);
    this._setupToggleButton();

    this.tagsSection.appendChild(this.tagsContainer);
    this.tagsSection.appendChild(this.toggleButton);

    return this.tagsSection;
  },

  /**
   * @param {Object} sortedTags - Object with tag names as keys and occurrence counts as values
   */
  _setupTagsContainer(sortedTags) {
    this.tagsContainer = document.createElement("div");
    this.tagsContainer.classList.add("tags-container");

    for (const tag of Object.keys(sortedTags)) {
      const tagButton = document.createElement("button");
      tagButton.textContent = `${tag} (${sortedTags[tag]})`;
      tagButton.addEventListener("click", (e) => onTagClick(e, tag));
      tagButton.classList.add("tag-button");

      this.tagsContainer.appendChild(tagButton);
    }
  },

  _setupToggleButton() {
    this.toggleButton = document.createElement("button");
    this.toggleButton.classList.add("toggle-tags-btn");
    this.toggleButton.textContent = this.collapsed ? "Show more" : "Show less";
    this.toggleButton.addEventListener("click", () => {
      if (this.collapsed) {
        this.tagsContainer.style.flexWrap = "wrap";
        this.tagsContainer.style.overflow = "visible";
        this.toggleButton.textContent = "Show less";
        this.collapsed = false;
      } else {
        this.tagsContainer.style.flexWrap = "nowrap";
        this.tagsContainer.style.overflow = "hidden";
        this.toggleButton.textContent = "Show more";
        this.collapsed = true;
      }
    });

    const checkOverflow = () => {
      const isOverflowing =
        this.tagsContainer.scrollWidth > this.tagsContainer.clientWidth;
      this.toggleButton.style.display = isOverflowing ? "" : "none";
    };

    window.addEventListener("resize", checkOverflow);

    setTimeout(checkOverflow, 0);
  },
};

export function setupTags() {
  const links = getResourceLinks();
  const sortedTags = getSortedTags(links);
  const searchBox = getSearchBox();
  searchBox.appendChild(tagsManager.createTagSection(sortedTags));
}

/**
 * @param {HTMLElement[]} links - Array of resource link elements
 * @returns {Object} Object with tag names as keys and occurrence counts as values, sorted by count
 */
function getSortedTags(links) {
  const tagsWithCount = {};
  const allTags = [];

  for (const link of links) {
    allTags.push(...(link?.dataset.tags?.split(",").filter(Boolean) || []));
  }

  for (const tag of allTags) {
    tagsWithCount[tag] = (tagsWithCount[tag] || 0) + 1;
  }

  return Object.entries(tagsWithCount)
    .sort((a, b) => b[1] - a[1])
    .filter(([_, count]) => count > 1)
    .reduce((acc, [tag, count]) => {
      acc[tag] = count;
      return acc;
    }, {});
}

/**
 * @param {Event} e - The click event object
 * @param {string} tag - The tag name that was clicked
 */
function onTagClick(e, tag) {
  const searchBar = getSearchBar();
  searchBar.value = `#${tag}`;
  searchBar.dispatchEvent(new Event("input"));
}
