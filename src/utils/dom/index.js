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

/**
 * @callback off
 * @returns {void}
 */
/**
 * @template {keyof HTMLElementEventMap} T
 * @callback eventHandler
 * @param {HTMLElementEventMap[T]} event
 */
/**
 * @template {keyof HTMLElementEventMap} T
 * @callback onRoot
 * @param {T} event
 * @param {eventHandler<T>} callback
 * @param {boolean | AddEventListenerOptions} options
 * @returns {off}
 */
/**
 * @template {keyof HTMLElementEventMap} T
 * @callback onElement
 * @param {HTMLElement} element
 * @param {T} event
 * @param {eventHandler<T>} callback
 * @param {boolean | AddEventListenerOptions} options
 * @returns {off}
 */
/**
 * @template {keyof HTMLElementEventMap} T
 * @type {onRoot<T> & onElement<T>}
 */
export const on = (elementOrEvent, eventOrCallback, callbackOrOptions, optionsOrNothing) => {
  const elementOrEventIsString = typeof elementOrEvent === 'string';
  const eventOrCallbackIsFunction = typeof eventOrCallback === 'function';
  const callbackOrOptionsIsFunction = typeof callbackOrOptions === 'function';

  /** @type {HTMLElement} */
  const element = !elementOrEventIsString ? elementOrEvent : root;
  /** @type {keyof HTMLElementEventMap} */
  const event = elementOrEventIsString ? elementOrEvent : eventOrCallback;
  /** @type {Function} */
  const callback = eventOrCallbackIsFunction ? eventOrCallback : callbackOrOptions;
  /** @type {boolean | AddEventListenerOptions} */
  let options = !callbackOrOptionsIsFunction ? callbackOrOptions : optionsOrNothing ?? {};

  if (typeof options === 'object' && options.passive === undefined) {
    options.passive = !callback.toString().includes('.preventDefault()');
  }

  element.addEventListener(event, callback, options);

  return () => element.removeEventListener(event, callback, options);
};

/** @type {typeof on} */
export const once = (elementOrEvent, eventOrCallback, callbackOrOptions, optionsOrNothing) => {
  return on(
    elementOrEvent,
    eventOrCallback,
    typeof callbackOrOptions === 'function'
      ? callbackOrOptions
      : { ...callbackOrOptions, once: true },
    typeof callbackOrOptions === 'function'
      ? { ...optionsOrNothing, once: true }
      : optionsOrNothing,
  );
};
