/** @type {DocumentFragment} */
let root = document;

/** @param {DocumentFragment} doc */
export const setRoot = (doc) => (root = doc);

/**
 * @param {string} query
 * @param {Element} [parent]
 */
export const $ = (query, parent = root) => parent && parent.querySelector(query);

/**
 * @param {string} query
 * @param {Element} [parent]
 * @returns {Element[]}
 */
export const $$ = (query, parent = root) => parent && [...parent.querySelectorAll(query)];

/**
 * @param {Element} element
 * @param {string} query
 * @returns {Element}
 */
export const closest = (element, query) => element && element.parentNode.closest(query);
