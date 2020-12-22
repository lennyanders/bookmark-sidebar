export const updateActionIcon = () => {
  const userPrefersDarkColorScheme = matchMedia('(prefers-color-scheme: dark)');
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const image = new Image();

  image.onload = () => {
    const { width, height } = image;
    canvas.width = width;
    canvas.height = height;
    context.drawImage(image, 0, 0);
    chrome.browserAction.setIcon({ imageData: context.getImageData(0, 0, width, height) });
  };

  const setActionIcon = () => {
    const color = userPrefersDarkColorScheme.matches ? 'fafafa' : '5b5e63';
    image.src = `data:image/svg+xml;base64,${btoa(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="#${color}"><path d="M13 12.75L8 11.4l-5 1.35V15l5-1.4 5 1.4v-2.25z"/><path d="M11 3h2v11h-2zM3 3h2v11H3z"/><path d="M11 5c1.105 0 2-.895 2-2 0-1.104-.896-2-2-2-1.105 0-2 .895-2 2h2v2z"/><path d="M5 1h6v2H5z"/><path d="M7 3c0-1.105-.895-2-2-2-1.104 0-2 .896-2 2 0 1.105.895 2 2 2V3h2z"/></svg>`,
    )}`;
  };

  // addEventListener does not work in content script, but maybe in the future so I leave it here
  userPrefersDarkColorScheme.addEventListener('change', setActionIcon);
  setActionIcon();
};
