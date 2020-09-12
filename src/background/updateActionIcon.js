export const updateActionIcon = () => {
  const userPrefersDarkColorScheme = matchMedia('(prefers-color-scheme: dark)');

  const setActionIcon = () => {
    const userColorScheme = userPrefersDarkColorScheme.matches ? 'dark/' : '';

    chrome.browserAction.setIcon({
      path: {
        16: `icons/${userColorScheme}browser-action-16.png`,
        24: `icons/${userColorScheme}browser-action-24.png`,
        32: `icons/${userColorScheme}browser-action-32.png`,
      },
    });
  };

  // addEventListener does not work in content script, but maybe in the future so I leave it here
  userPrefersDarkColorScheme.addEventListener('change', setActionIcon);
  setActionIcon();
};
