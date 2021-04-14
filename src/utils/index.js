/** @type {Record<string, string>} */
const baseUrlCache = {};
/** @param {string} url */
export const getBaseUrl = (url) => {
  const cacheResult = baseUrlCache[url];
  if (cacheResult) return cacheResult;

  return (baseUrlCache[url] = new URL(url).origin);
};

/**
 * @template T
 * @param {T[]} array
 * @param {string} recursionKey
 * @returns {T[]}
 */
export const flattenArrayOfObjects = (array, recursionKey) => {
  const result = [];
  for (const item of array) {
    result.push(item);

    if (item[recursionKey]) {
      result.push(...flattenArrayOfObjects(item[recursionKey], recursionKey));
    }
  }
  return result;
};

/**
 * @param {HTMLFormElement} form
 * @param {string | any} [ignoreKey]
 * @returns {Record<string, string>}
 */
export const getFormdataAsJson = (form, ignoreKey) => {
  const options = {};
  new FormData(form).forEach((value, key) => key !== ignoreKey && (options[key] = value));
  return options;
};
