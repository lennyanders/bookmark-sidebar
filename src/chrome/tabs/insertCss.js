/**
 * @param {chrome.tabs.InjectDetails} details
 * @returns {Promise<void>}
 */
export default (details) => new Promise((resolve) => chrome.tabs.insertCSS(details, resolve));
