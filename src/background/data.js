import { ports } from './middleware';

export const data = {};

let faviconUrls = new Set([]);
let faviconDataUrls = new Map();
let _shownBmId;

const getFaviconUrl = (url) => {
  return `chrome://favicon/size/32/${new URL(url).origin}`;
};

const getNewFaviconUrls = (bms, curFaviconUrls) => {
  return bms.reduce((res, { url }) => {
    const faviconUrl = getFaviconUrl(url);
    if (!curFaviconUrls.has(faviconUrl)) res.add(faviconUrl);
    return res;
  }, new Set([]));
};

const loadFavicons = (faviconUrls) => {
  if (!faviconUrls.size) return [];
  return new Promise((resolve, reject) => {
    let faviconDataUrls = new Map();

    for (const faviconUrl of faviconUrls) {
      const favicon = new Image();
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      favicon.onload = () => {
        canvas.width = favicon.width;
        canvas.height = favicon.height;
        context.drawImage(favicon, 0, 0);

        faviconDataUrls.set(faviconUrl, canvas.toDataURL('image/png'));

        if (faviconDataUrls.size === faviconUrls.size) resolve(faviconDataUrls);
      };
      favicon.src = faviconUrl;
    }
  });
};

const updateTree = () => {
  chrome.bookmarks.getTree(async ([bookmarks]) => {
    let shownFolder;
    let bmsToLoad = [];
    let folders = [];

    JSON.stringify(bookmarks, (_, nested) => {
      if (!nested.id) return nested;
      if (!nested.url) {
        if (nested.id === '0') nested.title = 'root';
        if (nested.id === _shownBmId) shownFolder = nested;

        folders.push({
          title: nested.title,
          id: nested.id,
        });
      } else if (shownFolder) {
        bmsToLoad.push(nested);
      }
      return nested;
    });

    const newFaviconUrls = getNewFaviconUrls(bmsToLoad, faviconUrls);
    if (newFaviconUrls.size) {
      faviconUrls = new Set([...faviconUrls, ...newFaviconUrls]);
      faviconDataUrls = new Map([
        ...faviconDataUrls,
        ...(await loadFavicons(newFaviconUrls)),
      ]);
    }
    // add favicon data urls to bookmarks that appear in the sidebar
    bmsToLoad.map((bm) => {
      bm.faviconDataUrl = faviconDataUrls.get(getFaviconUrl(bm.url));
    });

    data.bm = shownFolder;
    data.allFolders = folders;

    console.log(data);
    ports.forEach((postData) => postData());
  });
};

export const generateData = async () => {
  chrome.storage.sync.get(
    [
      'barLeft',
      'shownBmId',
      'barWidth',
      'barTheme',
      'editBookmarkOnRightClick',
    ],
    ({
      shownBmId = '0',
      barLeft = false,
      barWidth = 320,
      barTheme = 'system',
      editBookmarkOnRightClick = false,
    }) => {
      Object.assign(data, {
        barLeft,
        barWidth,
        barTheme,
        editBookmarkOnRightClick,
      });
      _shownBmId = shownBmId;
      updateTree();
    },
  );

  chrome.storage.onChanged.addListener(
    ({ shownBmId, barLeft, barWidth, barTheme, editBookmarkOnRightClick }) => {
      if (shownBmId) {
        _shownBmId = shownBmId.newValue;
        updateTree();
      }

      if (barLeft) data.barLeft = barLeft.newValue;
      if (barWidth) data.barWidth = barWidth.newValue;
      if (barTheme) data.barTheme = barTheme.newValue;
      if (editBookmarkOnRightClick)
        data.editBookmarkOnRightClick = editBookmarkOnRightClick.newValue;
    },
  );
  chrome.bookmarks.onRemoved.addListener(updateTree);
  chrome.bookmarks.onCreated.addListener(updateTree);
  chrome.bookmarks.onMoved.addListener(updateTree);
  chrome.bookmarks.onChanged.addListener(updateTree);
};
