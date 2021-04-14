import { shadowRoot as backgroundRoot } from '@background/data/root';
import { shadowRoot as contentRoot } from '@content/sidebarRoot';

/** @type {ShadowRoot} */
const root = process.env.ESBUILD_BUILD === 'background' ? backgroundRoot : contentRoot;

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
