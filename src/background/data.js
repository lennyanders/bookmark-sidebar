export let data = {};

let faviconUrls = new Set([]),
  faviconDataUrls = new Map(),
  _shownBmId;

const createFaviconUrl = url =>
  `chrome://favicon/${url
    .split('/')
    .slice(0, 3)
    .join('/')}`;

const getNewFaviconUrls = (bms, curFaviconUrls) => {
  let newFaviconUrls = new Set([]);
  bms.map(({ url }) => {
    const faviconUrl = createFaviconUrl(url);
    if (!curFaviconUrls.has(faviconUrl)) newFaviconUrls.add(faviconUrl);
  });
  return newFaviconUrls;
};

const loadFavicons = faviconUrls => {
  if (!faviconUrls.size) return [];
  return new Promise((resolve, reject) => {
    let faviconDataUrls = new Map();

    for (const faviconUrl of faviconUrls) {
      const favicon = new Image(),
        canvas = document.createElement('canvas'),
        context = canvas.getContext('2d');

      favicon.src = faviconUrl;
      favicon.addEventListener('load', () => {
        canvas.width = favicon.width;
        canvas.height = favicon.height;
        context.drawImage(favicon, 0, 0);

        faviconDataUrls.set(faviconUrl, canvas.toDataURL('image/png'));

        if (faviconDataUrls.size === faviconUrls.size) resolve(faviconDataUrls);
      });
    }
  });
};

const insertFaviconUrls = (bms, faviconDataUrls) => {
  bms.map(bm => {
    bm.faviconDataUrl = faviconDataUrls.get(createFaviconUrl(bm.url));
  });
};

const updateTree = () => {
  chrome.bookmarks.getTree(async ([bookmarks]) => {
    let shownFolder,
      bmsToLoad = [],
      folders = [];

    JSON.stringify(bookmarks, (_, nested) => {
      if (nested.id) {
        if (!nested.url) {
          if (nested.id === '0') nested.title = 'root';
          if (nested.id === _shownBmId) shownFolder = nested;

          folders.push({
            title: nested.title,
            id: nested.id
          });
        } else if (shownFolder) {
          bmsToLoad.push(nested);
        }
      }
      return nested;
    });

    const newFaviconUrls = getNewFaviconUrls(bmsToLoad, faviconUrls);
    if (newFaviconUrls.size) {
      faviconUrls = new Set([...faviconUrls, ...newFaviconUrls]);
      faviconDataUrls = new Map([
        ...faviconDataUrls,
        ...(await loadFavicons(newFaviconUrls))
      ]);
    }
    // add favicon data urls to bookmarks that appear in the sidebar
    bmsToLoad.map(bm => {
      bm.faviconDataUrl = faviconDataUrls.get(createFaviconUrl(bm.url));
    });

    data.bm = shownFolder;
    data.allFolders = folders;

    console.log(data);
    window.dispatchEvent(new CustomEvent('treeUpdated'));
  });
};

chrome.storage.sync.get(
  ['barLeft', 'shownBmId', 'barWidth'],
  ({ shownBmId, barLeft, barWidth, barTheme }) => {
    _shownBmId = shownBmId ? shownBmId : '0';

    data.barLeft = barLeft;
    data.barWidth = barWidth ? barWidth : 320;
    data.barTheme = barTheme ? barTheme : 'system';

    updateTree();
  }
);
chrome.storage.onChanged.addListener(
  ({ shownBmId, barLeft, barWidth, barTheme }) => {
    if (shownBmId) {
      _shownBmId = shownBmId.newValue;
      updateTree();
    }

    if (barLeft) data.barLeft = barLeft.newValue;
    if (barWidth) data.barWidth = barWidth.newValue;
    if (barTheme) data.barTheme = barTheme.newValue;
  }
);

chrome.bookmarks.onRemoved.addListener(updateTree);
chrome.bookmarks.onCreated.addListener(updateTree);
chrome.bookmarks.onMoved.addListener(updateTree);
chrome.bookmarks.onChanged.addListener(updateTree);
