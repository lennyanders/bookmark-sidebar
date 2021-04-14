/**
 * @callback CommandsCommandCallback
 * @param {chrome.tabs.Tab} tab
 */

/**
 * @param {string} command
 * @param {CommandsCommandCallback} callback
 */
export default (command, callback) => {
  chrome.commands.onCommand.addListener((currentCommand, tab) => {
    if (currentCommand === command) callback(tab);
  });
};
