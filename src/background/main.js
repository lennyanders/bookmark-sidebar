import { scriptRunsOnTab } from './create-toggle-bm-bar';
import { tree } from './tree';

const userColorScheme = matchMedia('(prefers-color-scheme: dark)').matches
  ? 'dark/'
  : '';

chrome.browserAction.setIcon({
  path: {
    '16': `icons/${userColorScheme}browser-action-16.png`,
    '24': `icons/${userColorScheme}browser-action-24.png`,
    '32': `icons/${userColorScheme}browser-action-32.png`
  }
});

export default chrome.runtime.onConnect.addListener(port => {
  console.assert(port.name === 'bmBar');

  port.onMessage.addListener(msg => {
    switch (msg.type) {
      case 'remove':
        chrome.bookmarks.removeTree(msg.id);
        break;
      case 'create':
        chrome.bookmarks.create({
          parentId: msg.parentId,
          title: msg.title,
          ...(msg.url && { url: msg.url })
        });
        break;
      case 'move':
        chrome.bookmarks.move(msg.id, {
          ...(typeof msg.index !== undefined && { index: msg.index }),
          ...(msg.parentId && { parentId: msg.parentId })
        });
        break;
      case 'update':
        chrome.bookmarks.update(msg.id, {
          ...(msg.title && { title: msg.title }),
          ...(msg.url && { url: msg.url })
        });
        break;
      default:
        break;
    }
  });

  const postTree = () => {
    port.postMessage({ tree: tree });
  };

  postTree();
  window.addEventListener('treeUpdated', postTree);

  port.onDisconnect.addListener(() => {
    window.removeEventListener('treeUpdated', postTree);

    chrome.tabs.query({ lastFocusedWindow: true, active: true }, ([tab]) => {
      scriptRunsOnTab.delete(tab.id);
    });
  });
});
