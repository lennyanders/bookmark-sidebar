/** @type {Map<string, string>} */
export const faviconDataUrls = new Map(JSON.parse(sessionStorage.getItem('favicons') || '[]'));

/** @param {string[]} urls */
export const loadFavicons = (urls) => Promise.all(urls.map(loadFavicon));

/**
 * @param {string} url
 * @returns {Promise<void>}
 */
const loadFavicon = (url) => {
  return new Promise((resolve, reject) => {
    const favicon = new Image();
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const rejectTimeout = setTimeout(() => reject(`Couln't load favicon for: ${url}`), 10000);
    favicon.onload = () => {
      canvas.width = favicon.width;
      canvas.height = favicon.height;
      context.drawImage(favicon, 0, 0);

      faviconDataUrls.set(url, canvas.toDataURL('image/png'));
      sessionStorage.setItem('favicons', JSON.stringify(Array.from(faviconDataUrls.entries())));

      clearTimeout(rejectTimeout);
      resolve();
    };
    favicon.src = `chrome://favicon/size/32/${url}`;
  });
};
