import loaderUtils from 'loader-utils';

export const pitch = function (request) {
  const { insert } = loaderUtils.getOptions(this) || {};

  const variable = `window['${insert || 'styles'}']`;

  return `
    const content = require(${loaderUtils.stringifyRequest(
      this,
      `!!${request}`,
    )}).default.toString();

    if (!${variable}) {
      ${variable} = content;
    } else {
      ${variable} += content
    }
  `;
};
