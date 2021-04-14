/**
 * @param {chrome.tabs.QueryInfo} queryInfo
 * @returns {Promise<chrome.tabs.Tab[]>}
 */
export default (queryInfo) => new Promise((resolve) => chrome.tabs.query(queryInfo, resolve));
