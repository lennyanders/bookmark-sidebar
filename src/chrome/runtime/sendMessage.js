export default (message) => new Promise((resolve) => chrome.runtime.sendMessage(message, resolve));
