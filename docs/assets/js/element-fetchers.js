/**
 * @returns {NodeListOf<HTMLAnchorElement>[]} An array containing all link elements from the three sections
 */
export const getResourceLinks = () =>
  document.querySelectorAll('[data-searchable]');

/**
 * @returns {HTMLInputElement} The search input element
 */
export const getSearchBar = () => document.querySelector('#search-bar');

/**
 * @returns {HTMLInputElement} The search box element
 */
export const getSearchBox = () => document.querySelector('#search-box');
