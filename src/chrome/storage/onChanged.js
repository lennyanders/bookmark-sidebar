/**
 * @callback StorageChangedCallback
 * @param {Record<string, chrome.storage.StorageChange>} changes
 * @param {chrome.storage.AreaName} areaName
 */

/** @param {StorageChangedCallback} callback */
export default (callback) => chrome.storage.onChanged.addListener(callback);
