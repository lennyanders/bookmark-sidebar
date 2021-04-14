/**
 * @param {chrome.tabs.CreateProperties}createProperties
 * @returns {Promise<chrome.tabs.Tab>}
 */
export default (createProperties) => {
  return new Promise((resolve) => chrome.tabs.create(createProperties, resolve));
};
