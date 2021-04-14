/**
 * @param {TemplateStringsArray} template
 * @param  {any[]} substitutions
 */
export const html = (template, ...substitutions) =>
  template
    .map((string, i) => {
      let value = substitutions[i];
      if (!value && value !== 0) {
        value = '';
      } else if (Array.isArray(value)) {
        value = value.join('');
      } else if (typeof value === 'function') {
        value = value();
      }
      return string + value;
    })
    .join('')
    .replace(/>\s+</g, '><')
    .replace(/"\s+>/g, '">')
    .replace(/\s+/g, ' ');
