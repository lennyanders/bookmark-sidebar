export let tree;

let faviconUrls = new Set([]),
  faviconDataUrls = new Map();

const createFaviconUrl = url =>
  `chrome://favicon/${url
    .split('/')
    .slice(0, 3)
    .join('/')}`;

const getNewFaviconUrls = (tree, curFaviconUrls) => {
  let newFaviconUrls = new Set([]);
  JSON.stringify(tree, (_, nestedObj) => {
    if (nestedObj && nestedObj.url) {
      const faviconUrl = createFaviconUrl(nestedObj.url);
      if (!curFaviconUrls.has(faviconUrl)) newFaviconUrls.add(faviconUrl);
    }
    return nestedObj;
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

const insertFaviconUrls = (tree, faviconDataUrls) => {
  JSON.stringify(tree, (_, nestedObj) => {
    if (nestedObj && nestedObj.url) {
      nestedObj.faviconDataUrl = faviconDataUrls.get(
        createFaviconUrl(nestedObj.url)
      );
    }
    return nestedObj;
  });
  return tree;
};

const updateTree = () => {
  chrome.bookmarks.getSubTree('2', async ([bookmarks]) => {
    const newFaviconUrls = getNewFaviconUrls(bookmarks, faviconUrls);
    if (newFaviconUrls.size) {
      faviconUrls = new Set([...faviconUrls, ...newFaviconUrls]);

      faviconDataUrls = new Map([
        ...faviconDataUrls,
        ...(await loadFavicons(newFaviconUrls))
      ]);
    }

    tree = insertFaviconUrls(bookmarks, faviconDataUrls);
    console.log(tree);

    window.dispatchEvent(new CustomEvent('treeUpdated'));
  });
};

updateTree();
chrome.bookmarks.onRemoved.addListener(updateTree);
chrome.bookmarks.onCreated.addListener(updateTree);
chrome.bookmarks.onMoved.addListener(updateTree);
chrome.bookmarks.onChanged.addListener(updateTree);
