export const updateActionIcon = () => {
  const userColorScheme = matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark/'
    : '';

  chrome.browserAction.setIcon({
    path: {
      '16': `icons/${userColorScheme}browser-action-16.png`,
      '24': `icons/${userColorScheme}browser-action-24.png`,
      '32': `icons/${userColorScheme}browser-action-32.png`,
    },
  });
};
