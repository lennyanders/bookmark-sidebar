import { shallowReactive } from '@vue/reactivity';
import { watch } from '@vue-reactivity/watch';
import { flattenBms, getBaseUrl } from '@shared/utils';
import { defaults } from '@shared/settings';

export const data = shallowReactive({});

const faviconDataUrls = new Map();

const loadFavicons = (baseUrls) =>
  new Promise((resolve, _reject) => {
    const prevSize = faviconDataUrls.size;

    for (const baseUrl of baseUrls) {
      const favicon = new Image();
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      favicon.onload = () => {
        canvas.width = favicon.width;
        canvas.height = favicon.height;
        context.drawImage(favicon, 0, 0);

        faviconDataUrls.set(baseUrl, canvas.toDataURL('image/png'));

        if (faviconDataUrls.size - prevSize === baseUrls.length) resolve();
      };
      favicon.src = `chrome://favicon/size/32/${baseUrl}`;
    }
  });

const updateTree = () => {
  chrome.bookmarks.getTree(async ([bookmark]) => {
    let shownFolder;
    let bmsToLoad = [];
    let folders = [];

    bookmark.title = 'Root';
    const flattenedBms = [bookmark, ...flattenBms(bookmark.children)];
    for (const bm of flattenedBms) {
      if (!bm.url) {
        if (bm.id === data.shownBmId) shownFolder = bm;

        folders.push({ title: bm.title, id: bm.id });
      } else if (shownFolder) {
        bmsToLoad.push(bm);
      }
    }

    const curBaseUrls = [...new Set(bmsToLoad.map(({ url }) => getBaseUrl(url)))];
    const newBaseUrls = curBaseUrls.filter((baseUrl) => !faviconDataUrls.has(baseUrl));
    if (newBaseUrls.length) await loadFavicons(newBaseUrls);

    data.faviconDataUrls = curBaseUrls.reduce(
      (res, url) => ({ ...res, [url]: faviconDataUrls.get(url) }),
      {},
    );
    data.bm = shownFolder;
    data.allFolders = folders;

    console.log(data);
  });
};

watch(() => data.shownBmId, updateTree);

export const generateData = async () => {
  chrome.storage.sync.get(
    ['shownBmId', 'barLeft', 'barWidth', 'barTheme', 'editBookmarkOnRightClick'],
    (settings) => Object.assign(data, defaults, settings),
  );
  chrome.storage.onChanged.addListener(
    ({ shownBmId, barLeft, barWidth, barTheme, editBookmarkOnRightClick }) => {
      Object.assign(data, {
        ...(shownBmId && { shownBmId: shownBmId.newValue }),
        ...(barLeft !== undefined && { barLeft: barLeft.newValue }),
        ...(barWidth && { barWidth: barWidth.newValue }),
        ...(barTheme && { barTheme: barTheme.newValue }),
        ...(editBookmarkOnRightClick !== undefined && {
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
