export const flattenBms = (bms) => {
  const result = [];
  for (const bm of bms) {
    result.push(bm);

    if (bm.children) result.push(...flattenBms(bm.children));
  }
  return result;
};

export const i18n = chrome.i18n.getMessage;

const baseUrlCache = {};
export const getBaseUrl = (url) => {
  const cacheResult = baseUrlCache[url];
  if (cacheResult) return cacheResult;

  return (baseUrlCache[url] = new URL(url).origin);
};
