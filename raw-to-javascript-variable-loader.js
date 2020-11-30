const { getOptions, stringifyRequest } = require('loader-utils');

module.exports.pitch = function (request) {
  const { insert } = getOptions(this) || {};

  const variable = `window['${insert || 'styles'}']`;

  return `
    const content = require(${stringifyRequest(
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
