/**
 * @param {chrome.tabs.InjectDetails} details
 * @returns {Promise<any[]>}
 */
export default (details) => new Promise((resolve) => chrome.tabs.executeScript(details, resolve));
