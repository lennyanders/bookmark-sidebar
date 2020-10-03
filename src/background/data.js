import { shallowReactive } from '@vue/reactivity';
import { watch } from '@vue-reactivity/watch';

export const data = shallowReactive({});

let faviconUrls = new Set([]);
let faviconDataUrls = new Map();

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
        if (nested.id === data.shownBmId) shownFolder = nested;

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
  });
};

watch(() => data.shownBmId, updateTree);

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
        shownBmId,
      });
    },
  );

  chrome.storage.onChanged.addListener(
    ({ shownBmId, barLeft, barWidth, barTheme, editBookmarkOnRightClick }) => {
      Object.assign(data, {
        ...(shownBmId && { shownBmId: shownBmId.newValue }),
        ...(barLeft && { barLeft: barLeft.newValue }),
        ...(barWidth && { barWidth: barWidth.newValue }),
        ...(barTheme && { barTheme: barTheme.newValue }),
        ...(editBookmarkOnRightClick && {
          editBookmarkOnRightClick: editBookmarkOnRightClick.newValue,
        }),
      });
    },
  );
  chrome.bookmarks.onRemoved.addListener(updateTree);
  chrome.bookmarks.onCreated.addListener(updateTree);
  chrome.bookmarks.onMoved.addListener(updateTree);
  chrome.bookmarks.onChanged.addListener(updateTree);
};
